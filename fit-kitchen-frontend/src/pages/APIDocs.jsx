import { ChevronDown, ChevronRight, Code, Send } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '../api/axios';
import '../styles/APIDocs.css';

const APIDocs = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState('');
  const [expandedSection, setExpandedSection] = useState('auth');
  const [requestBody, setRequestBody] = useState('{\n  "key": "value"\n}');
  const [httpMethod, setHttpMethod] = useState('GET');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bearerToken, setBearerToken] = useState('');

  const apiEndpoints = {
    auth: {
      title: 'Authentication',
      endpoints: [
        {
          path: '/api/auth/register',
          method: 'POST',
          description: 'Register a new user',
          body: {
            username: 'string',
            email: 'string',
            password: 'string'
          }
        },
        {
          path: '/api/auth/login',
          method: 'POST',
          description: 'User login',
          body: {
            email: 'string',
            password: 'string'
          }
        },
        {
          path: '/api/auth/logout',
          method: 'POST',
          description: 'User logout',
          body: null,
          auth: true
        },
        {
          path: '/api/auth/google',
          method: 'GET',
          description: 'Initiate Google OAuth flow'
        },
        {
          path: '/api/auth/callback',
          method: 'POST',
          description: 'Handle OAuth callback',
          body: {
            access_token: 'string'
          }
        }
      ]
    },
    profile: {
      title: 'Profile & Health Assessment',
      endpoints: [
        {
          path: '/api/profile',
          method: 'GET',
          description: 'Get user profile',
          auth: true
        },
        {
          path: '/api/profile',
          method: 'PUT',
          description: 'Update user profile',
          auth: true,
          body: {
            health_history: 'object',
            activity_level: 'string',
            health_goal: 'string'
          }
        },
        {
          path: '/api/health-assessment',
          method: 'POST',
          description: 'Submit health assessment',
          auth: true,
          body: {
            height: 'number',
            weight: 'number',
            age: 'number',
            gender: 'string',
            health_history: 'object'
          }
        }
      ]
    },
    menu: {
      title: 'Menu Management',
      endpoints: [
        {
          path: '/api/menu/search',
          method: 'GET',
          description: 'Search menus',
          query: ['search', 'categoryId', 'minCalories', 'maxCalories']
        },
        {
          path: '/api/menu/category/:category',
          method: 'GET',
          description: 'Get menus by category'
        },
        {
          path: '/api/menu/recommended',
          method: 'GET',
          description: 'Get recommended menus',
          auth: true
        },
        {
          path: '/api/menu/validate-selection',
          method: 'POST',
          description: 'Validate menu selection',
          auth: true,
          body: {
            menuIds: 'array',
            plan_type: 'string'
          }
        }
      ]
    },
    mealPlan: {
      title: 'Meal Plan',
      endpoints: [
        {
          path: '/api/meal-plan/initialize',
          method: 'POST',
          description: 'Initialize meal plan',
          auth: true,
          body: {
            plan_type: 'string'
          }
        },
        {
          path: '/api/meal-plan/create',
          method: 'POST',
          description: 'Create meal plan',
          auth: true,
          body: {
            plan_type: 'string',
            menuIds: 'array'
          }
        },
        {
          path: '/api/meal-plan/active',
          method: 'GET',
          description: 'Get active meal plans',
          auth: true
        },
        {
          path: '/api/meal-plan/:plan_id/status',
          method: 'PUT',
          description: 'Update plan status',
          auth: true,
          body: {
            status: 'string'
          }
        },
        {
          path: '/api/meal-plan/history',
          method: 'GET',
          description: 'Get meal plan history',
          auth: true,
          query: ['status', 'limit', 'offset']
        }
      ]
    },
    recipe: {
      title: 'Recipe Generation',
      endpoints: [
        {
          path: 'https://smart-health-tst.up.railway.app/api/recipes',
          method: 'POST',
          description: 'Generate recipe recommendations',
          body: {
            ingredients: 'array'
          },
          external: true
        }
      ]
    }
  };

  return (
    <div className="api-docs">
      {/* Header */}
      <div className="api-docs-header">
        <h1 className="api-docs-title">FitKitchen API Sandbox</h1>
        <p className="api-docs-description">
          Experiment with our API and see how FitKitchen can streamline your healthy meal planning.
        </p>
      </div>

      {/* API List */}
      <div className="api-docs-content">
        <div className="api-list">
          <h2 className="api-list-title">API Endpoints</h2>
          
          {Object.entries(apiEndpoints).map(([key, section]) => (
            <div key={key} className="api-section">
              <button
                className="api-section-header"
                onClick={() => setExpandedSection(expandedSection === key ? '' : key)}
              >
                {expandedSection === key ? (
                  <ChevronDown className="icon" />
                ) : (
                  <ChevronRight className="icon" />
                )}
                <span className="api-section-title">{section.title}</span>
              </button>
              
              {expandedSection === key && (
                <div className="api-endpoints">
                  {section.endpoints.map((endpoint, index) => (
                    <button
                      key={index}
                      className={`api-endpoint-button ${
                        selectedEndpoint === `${key}-${index}` ? 'selected' : ''
                      }`}
                      onClick={() => {
                        setSelectedEndpoint(`${key}-${index}`);
                        setHttpMethod(endpoint.method);
                        setRequestBody(
                          endpoint.body 
                            ? JSON.stringify(endpoint.body, null, 2)
                            : ''
                        );
                      }}
                    >
                      <Code className="icon" />
                      <span className="endpoint-path">{endpoint.path}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right Panel - API Tester */}
        <div className="api-tester">
          <h2 className="api-tester-title">Try the API</h2>

          {/* Method Selection */}
          <div className="method-select-group">
            <label className="method-label">HTTP Method</label>
            <select
              value={httpMethod}
              onChange={(e) => setHttpMethod(e.target.value)}
              className="method-select"
            >
              <option>GET</option>
              <option>POST</option>
              <option>PUT</option>
              <option>DELETE</option>
            </select>
          </div>

          {/* Auth Token Input - appear when needed*/}
          {selectedEndpoint && (() => {
            const [section, index] = selectedEndpoint.split('-');
            const endpoint = apiEndpoints[section].endpoints[parseInt(index)];
            return endpoint.auth ? (
              <div className="auth-token-group">
                <label className="auth-token-label">
                  Bearer Token
                  <span className="auth-required-badge">Required</span>
                </label>
                <input
                  type="text"
                  value={bearerToken}
                  onChange={(e) => setBearerToken(e.target.value)}
                  className="auth-token-input"
                  placeholder="Enter your Bearer token"
                />
                <small className="auth-token-helper">
                  This endpoint requires authentication. Please provide a valid Bearer token.
                </small>
              </div>
            ) : null;
          })()}

          {/* Request Body */}
          <div className="request-body-group">
            <label className="request-body-label">Request Body (JSON)</label>
            <textarea
              value={requestBody}
              onChange={(e) => setRequestBody(e.target.value)}
              className="request-body-textarea"
              placeholder="Enter request body..."
            />
          </div>

          {/* Send Button */}
          <button 
            className={`send-button ${loading ? 'loading' : ''}`}
            onClick={async () => {
              if (!selectedEndpoint) {
                toast.error('Please select an endpoint first');
                return;
              }

              setLoading(true);
              setError(null);
              setResponse(null);

              try {
                const [section, index] = selectedEndpoint.split('-');
                const endpoint = apiEndpoints[section].endpoints[parseInt(index)];
                
                let url = endpoint.path;
                let data = null;

                try {
                  if (requestBody) {
                    data = JSON.parse(requestBody);
                  }
                } catch (e) {
                  toast.error('Invalid JSON in request body');
                  setLoading(false);
                  return;
                }

                let config = {
                  method: httpMethod,
                  headers: {
                    'Content-Type': 'application/json',
                    ...(endpoint.auth && bearerToken ? {
                      'Authorization': `Bearer ${bearerToken}`
                    } : {})
                  }
                };

                if (data && ['POST', 'PUT', 'PATCH'].includes(httpMethod)) {
                  config.data = data;
                }

                if (endpoint.auth && !bearerToken) {
                  toast.error('This endpoint requires a Bearer token');
                  setLoading(false);
                  return;
                }

                if (endpoint.external) {
                  // For external API calls
                  const result = await fetch(url, {
                    method: httpMethod,
                    headers: {
                      'Content-Type': 'application/json',
                      ...(endpoint.auth && bearerToken ? {
                        'Authorization': `Bearer ${bearerToken}`
                      } : {})
                    },
                    body: data ? JSON.stringify(data) : undefined
                  });
                  const json = await result.json();
                  setResponse(json);
                } else {
                  const result = await api({
                    url: url,
                    ...config
                  });
                  setResponse(result);
                }
              } catch (err) {
                setError(err);
                setResponse(err.response?.data || {
                  error: {
                    message: err.message,
                    details: err.stack
                  }
                });
                toast.error('Request failed: ' + err.message);
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
          >
            <Send className="icon" />
            {loading ? 'Sending...' : 'Send Request'}
          </button>

          {/* Response Section */}
          <div className="response-section">
            <h3 className="response-title">Response</h3>
            <div className="response-preview">
              <pre className="response-code">
                {response ? (
                  typeof response === 'string' 
                    ? response
                    : JSON.stringify(response, null, 2)
                ) : (
                  "Select an endpoint and click \"Send Request\" to see the response here."
                )}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIDocs;