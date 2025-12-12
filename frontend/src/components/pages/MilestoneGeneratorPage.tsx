import { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { apiClient } from '../../services/api';

export const MilestoneGeneratorPage = () => {
  const [formData, setFormData] = useState({
    project_description: '',
    total_budget: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await apiClient.generateMilestones({
        project_description: formData.project_description,
        total_budget: parseFloat(formData.total_budget),
      });
      setResult(response);
    } catch (err) {
      console.error('Milestone generation failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-dark text-white p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">AI Milestone Generator</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Project Description"
            value={formData.project_description}
            onChange={(e) => setFormData(prev => ({ ...prev, project_description: e.target.value }))}
            placeholder="Describe your project..."
            className="bg-card-dark border-border-dark"
          />
          
          <Input
            label="Total Budget"
            type="number"
            value={formData.total_budget}
            onChange={(e) => setFormData(prev => ({ ...prev, total_budget: e.target.value }))}
            placeholder="Enter budget amount"
            className="bg-card-dark border-border-dark"
          />
          
          <Button type="submit" loading={isLoading} className="w-full">
            Generate Milestones
          </Button>
        </form>

        {result && (
          <div className="mt-6 p-4 bg-card-dark rounded-lg border border-border-dark">
            <h3 className="font-bold mb-2">Generated Milestones:</h3>
            <pre className="text-sm text-text-secondary">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};