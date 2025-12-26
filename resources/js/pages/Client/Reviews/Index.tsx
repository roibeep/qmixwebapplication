import { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BreadcrumbItem } from '@/types';
import { PageProps as InertiaPageProps } from '@inertiajs/core';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Client Review', href: '/client/reviews' },
];

interface PageProps extends InertiaPageProps {
  flash?: { 
    success?: string;
  };
}

interface Answers {
  q1: 'yes' | 'no' | '';
  q2: 'yes' | 'no' | '';
  q3: 'yes' | 'no' | '';
  q4: 'yes' | 'no' | '';
  q5: string; // Rating 1-5
  q6: string; // Rating 1-5
  q7: string; // Essay
  q8: string;
  q9: string;
  q10: string;
}

export default function ClientReviewIndex() {
  const { flash } = usePage<PageProps>().props;
  
  const [answers, setAnswers] = useState<Answers>({
    q1: '', q2: '', q3: '', q4: '',
    q5: '', q6: '', q7: '', q8: '', q9: '', q10: ''
  });

  const handleChange = (key: keyof Answers, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.post('/client/reviews', answers as any, {
      onSuccess: () => {
        // Reset form after successful submission
        setAnswers({
          q1: '', q2: '', q3: '', q4: '',
          q5: '', q6: '', q7: '', q8: '', q9: '', q10: ''
        });
      },
    });
  };

  const yesNoQuestions = [
    'Did the service meet your expectations?',
    'Was the staff friendly and professional?',
    'Was the project delivered on time?',
    'Would you recommend our services?',
  ];

  const ratingQuestions = [
    'Overall Quality of Service',
    'Communication and Support',
  ];

  const essayQuestions = [
    'What did you like most about our service?',
    'What areas do you think we could improve?',
    'Any additional comments or feedback?',
    'How did you hear about us?',
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Card className="p-6 rounded-none">
        <h1 className="text-2xl font-bold mb-6">Client Review</h1>
        
        {flash?.success && (
          <p className="mb-4 p-2 bg-green-100 text-green-800 rounded">
            {flash.success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Q1–Q4: Yes/No Questions in 2-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(['q1', 'q2', 'q3', 'q4'] as (keyof Answers)[]).map((key, idx) => (
              <div key={key}>
                <label className="block font-medium mb-2">
                  Q{idx + 1}: {yesNoQuestions[idx]}
                </label>
                <div className="flex gap-6">
                  {['yes', 'no'].map(val => (
                    <label key={val} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={key}
                        value={val}
                        checked={answers[key] === val}
                        onChange={(e) => handleChange(key, e.target.value as 'yes' | 'no')}
                        className="cursor-pointer"
                      />
                      {val.charAt(0).toUpperCase() + val.slice(1)}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Q5–Q6: Ratings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(['q5', 'q6'] as (keyof Answers)[]).map((key, idx) => (
              <div key={key}>
                <label className="block font-medium mb-2">
                  Q{idx + 5}: {ratingQuestions[idx]} (1-5)
                </label>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  value={answers[key]}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    handleChange(key, e.target.value)
                  }
                  placeholder="Rate 1-5"
                  className="w-32"
                />
              </div>
            ))}
          </div>

          {/* Q7–Q10: Essay questions */}
          {(['q7', 'q8', 'q9', 'q10'] as (keyof Answers)[]).map((key, idx) => (
            <div key={key}>
              <label className="block font-medium mb-2">
                Q{idx + 7}: {essayQuestions[idx]}
              </label>
              <textarea
                value={answers[key]}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                  handleChange(key, e.target.value)
                }
                placeholder="Write your answer here..."
                rows={4}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}

          <div className="flex justify-end">
            <Button type="submit">Submit Review</Button>
          </div>
        </form>
      </Card>
    </AppLayout>
  );
}