
import { supabase } from "@/lib/supabase";
import { PlagiarismResult } from "./PlagiarismChecker";
import { useToast } from "@/hooks/use-toast";

export const usePlagiarismDatabase = () => {
  const { toast } = useToast();

  const saveResultsToDatabase = async (
    results: PlagiarismResult, 
    fileName: string, 
    userId: string
  ) => {
    if (!userId) {
      console.log("User not logged in, skipping database save");
      return;
    }

    try {
      // First try to directly insert the data without going through the trigger
      // by using the RPC call to bypass the materialized view refresh
      try {
        const { data, error } = await supabase.rpc('insert_plagiarism_query', {
          p_user_id: userId,
          p_query_text: `Plagiarism Check: ${fileName}`,
          p_search_params: JSON.stringify({ 
            fileName,
            score: results.score,
            checkedAt: new Date().toISOString()
          })
        });

        if (!error && data) {
          // If RPC worked, save the results using the returned ID
          if (results.matches.length > 0 && data.id) {
            await saveSearchResults(results.matches, data.id);
          }
          
          toast({
            title: "Results saved",
            description: "Plagiarism check results have been saved to your dashboard.",
            variant: "success"
          });
          
          return true;
        }
      } catch (rpcError) {
        console.log("RPC method not available, falling back to direct insert");
      }

      // Fall back to regular insert if RPC fails
      const { data: searchQuery, error: searchQueryError } = await supabase
        .from('search_queries')
        .insert({
          user_id: userId,
          query_type: 'plagiarism',
          query_text: `Plagiarism Check: ${fileName}`,
          search_params_json: JSON.stringify({ 
            fileName,
            score: results.score,
            checkedAt: new Date().toISOString()
          })
        })
        .select()
        .single();

      if (searchQueryError) {
        // Handle the specific error related to popular_searches materialized view
        if (searchQueryError.message?.includes('popular_searches')) {
          console.log("Error with popular_searches view, but continuing with save process");
          // Try to get the inserted record ID using a separate select query
          const { data: latestQuery } = await supabase
            .from('search_queries')
            .select('id')
            .eq('user_id', userId)
            .eq('query_type', 'plagiarism')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
            
          if (latestQuery?.id) {
            // Continue with saving the results using the retrieved ID
            await saveSearchResults(results.matches, latestQuery.id);
            
            toast({
              title: "Results saved",
              description: "Plagiarism check results have been saved to your dashboard.",
              variant: "success"
            });
            
            return true;
          } else {
            // If we can't get the ID, try direct insert without trigger
            const { data: directInsert, error: directError } = await supabase.rpc(
              'direct_insert_search_query',
              {
                p_user_id: userId,
                p_query_type: 'plagiarism',
                p_query_text: `Plagiarism Check: ${fileName}`,
                p_search_params_json: JSON.stringify({ 
                  fileName,
                  score: results.score,
                  checkedAt: new Date().toISOString()
                })
              }
            );
            
            if (!directError && directInsert?.id) {
              await saveSearchResults(results.matches, directInsert.id);
              
              toast({
                title: "Results saved",
                description: "Plagiarism check results have been saved to your dashboard.",
                variant: "success"
              });
              
              return true;
            }
          }
        }
        
        // If we got here, there was an error and we couldn't recover
        console.error("Error saving search query:", searchQueryError);
        
        // Don't throw, instead show a helpful toast and continue
        toast({
          title: "Results saved locally only",
          description: "Due to a database permission issue, results are only available in this session.",
          variant: "default"
        });
        
        return false;
      }

      // If we got here, save the results normally
      if (results.matches.length > 0 && searchQuery?.id) {
        await saveSearchResults(results.matches, searchQuery.id);
      }

      toast({
        title: "Results saved",
        description: "Plagiarism check results have been saved to your dashboard.",
        variant: "success"
      });

      return true;
    } catch (error) {
      console.error("Error saving results to database:", error);
      
      // Show a more user-friendly error message
      toast({
        title: "Results available locally",
        description: "We couldn't save to your dashboard, but results are available in this session.",
        variant: "default"
      });
      
      return false;
    }
  };
  
  // Helper function to save search results
  const saveSearchResults = async (matches, searchId) => {
    if (matches.length === 0 || !searchId) return;
    
    const searchResults = matches.map(match => ({
      search_id: searchId,
      title: match.text.substring(0, 50) + (match.text.length > 50 ? '...' : ''),
      url: match.source,
      thumbnail: '', // No thumbnail for plagiarism matches
      source: new URL(match.source).hostname,
      match_level: match.similarity > 0.7 ? 'High' : match.similarity > 0.4 ? 'Medium' : 'Low',
      found_at: new Date().toISOString(),
      similarity_score: match.similarity
    }));

    const { error: resultsError } = await supabase
      .from('search_results')
      .insert(searchResults);

    if (resultsError) {
      console.error("Error saving search results:", resultsError);
      throw new Error(`Failed to save search results: ${resultsError.message}`);
    }
  };

  return { saveResultsToDatabase };
};
