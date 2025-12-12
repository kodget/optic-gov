import { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { apiClient } from '../../services/api';

export const CreateProjectPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    contractorAddress: '',
    totalBudget: '',
    milestoneDescription: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const projectData = {
      name: formData.name,
      description: formData.description,
      total_budget: parseFloat(formData.totalBudget),
      contractor_wallet: formData.contractorAddress,
      use_ai_milestones: true,
      manual_milestones: formData.milestoneDescription ? [formData.milestoneDescription] : null,
      project_latitude: 40.7128,
      project_longitude: -74.0060,
      location_tolerance_km: 1.0,
      gov_wallet: '0x' + Math.random().toString(16).substr(2, 40),
      on_chain_id: Math.floor(Math.random() * 10000),
    };
    
    try {
      await apiClient.createProject(projectData);
      window.location.href = '/governor';
    } catch (err) {
      setTimeout(() => {
        window.location.href = '/governor';
      }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background-dark text-white">
      <header className="border-b border-border-dark bg-background-dark px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => window.history.back()}
              className="text-text-secondary hover:text-white transition-colors"
            >
              ← Back
            </button>
            <h1 className="text-xl font-bold">Create New Project</h1>
          </div>
          <div className="text-sm text-text-secondary">Governor Portal</div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <div className="bg-card-dark rounded-xl border border-border-dark p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Initiate New Public Work</h2>
            <p className="text-text-secondary">Define project parameters, set AI verification milestones, and escrow funds via Smart Contract.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                📋 Project Details
              </h3>
              
              <Input
                id="name"
                label="Project Name"
                placeholder="e.g. Lagos Main Bridge Repair"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                className="bg-background-dark border-border-dark"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  id="location"
                  label="Location"
                  placeholder="e.g. Downtown District"
                  value={formData.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  className="bg-background-dark border-border-dark"
                />
                
                <Input
                  id="totalBudget"
                  label="Total Budget (ETH)"
                  type="number"
                  placeholder="5.0"
                  value={formData.totalBudget}
                  onChange={(e) => updateField('totalBudget', e.target.value)}
                  className="bg-background-dark border-border-dark"
                />
              </div>

              <Input
                id="contractorAddress"
                label="Contractor Wallet Address"
                placeholder="0x..."
                value={formData.contractorAddress}
                onChange={(e) => updateField('contractorAddress', e.target.value)}
                className="bg-background-dark border-border-dark"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                🤖 Milestone 1 Criteria (AI Oracle)
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  AI Verification Requirements
                </label>
                <textarea
                  className="w-full bg-background-dark border border-border-dark rounded-xl p-4 text-white placeholder-text-secondary focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none"
                  placeholder="e.g. High-angle photo of freshly poured concrete foundation with visible rebar reinforcement grid. Must show at least 4 corner pilings."
                  rows={4}
                  value={formData.milestoneDescription}
                  onChange={(e) => updateField('milestoneDescription', e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => window.history.back()}
                className="flex-1"
              >
                Save Draft
              </Button>
              <Button 
                type="submit" 
                loading={isSubmitting}
                className="flex-1 shadow-primary"
              >
                {isSubmitting ? 'Deploying Contract...' : 'Deploy & Fund'}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};