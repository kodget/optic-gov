import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { apiClient } from '../../services/api';

export const HealthCheckPage = () => {
  const [status, setStatus] = useState<'loading' | 'healthy' | 'error'>('loading');
  const [response, setResponse] = useState<any>(null);

  const checkHealth = async () => {
    setStatus('loading');
    try {
      const result = await apiClient.healthCheck();
      setResponse(result);
      setStatus('healthy');
    } catch (err) {
      setStatus('error');
      setResponse(err);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="min-h-screen bg-background-dark text-white p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">API Health Check</h1>
        
        <div className="space-y-4">
          <div className={`p-4 rounded-lg border ${
            status === 'healthy' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
            status === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
            'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
          }`}>
            Status: {status === 'loading' ? 'Checking...' : status === 'healthy' ? 'Healthy' : 'Error'}
          </div>

          <Button onClick={checkHealth} className="w-full">
            Refresh Health Check
          </Button>

          {response && (
            <div className="p-4 bg-card-dark rounded-lg border border-border-dark">
              <h3 className="font-bold mb-2">Response:</h3>
              <pre className="text-sm text-text-secondary overflow-auto">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};