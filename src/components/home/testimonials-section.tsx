
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Star } from "lucide-react";

// Sample testimonial data
const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Content Creator",
    avatar: "https://i.pravatar.cc/150?u=1",
    content: "InfluenceGuard helped me discover 24 instances of my content being used without permission. The DMCA assistance made the takedown process so much easier.",
    rating: 5
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Photographer",
    avatar: "https://i.pravatar.cc/150?u=2",
    content: "As a photographer, protecting my work is crucial. This platform has become an essential part of my business. The real-time alerts notify me instantly when my photos appear online saves me hours of manual searching.",
    rating: 5
  }
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="h-full">
      <div className="h-full">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold mb-2">What Our Users Say</h2>
          <p className="text-sm text-muted-foreground">
            Trusted by content creators worldwide
          </p>
        </div>
        
        <div className="space-y-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="relative overflow-hidden glass-card transition-all duration-300 hover:shadow-lg
              before:absolute before:inset-0 before:rounded-xl before:p-[2px] before:bg-gradient-to-r before:from-purple-200 before:via-blue-200 before:to-indigo-200 dark:before:from-purple-900/30 dark:before:via-blue-900/30 dark:before:to-indigo-900/30 before:-z-10
              after:absolute after:inset-[2px] after:rounded-[calc(0.75rem-2px)] after:bg-white dark:after:bg-gray-900 after:-z-10">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10 border-2 border-primary/20">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>
                      <User className="h-5 w-5 text-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">{testimonial.role}</p>
                      </div>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="mt-2 text-sm">{testimonial.content}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
