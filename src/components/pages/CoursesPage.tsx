import { motion } from 'framer-motion';
import { BookOpen, Clock, ExternalLink } from 'lucide-react';
import { courseSuggestions } from '@/lib/careerData';

export default function CoursesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Smart Course Recommender</h1>
        <p className="text-muted-foreground mt-1">Courses tailored to fill your skill gaps</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courseSuggestions.map((course, i) => (
          <motion.div
            key={course.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-gradient-card rounded-xl p-6 border border-border hover:border-primary/30 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              {course.free && (
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">Free</span>
              )}
            </div>
            <h3 className="font-display font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{course.name}</h3>
            <p className="text-sm text-muted-foreground mb-3">Skill: {course.skill}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {course.duration}</span>
              <span>{course.platform}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
