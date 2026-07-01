import { Card, CardHeader, CardContent, Button, Grid } from '@pv/ui';

export function Apps() {
  const apps = [
    { id: '1', name: 'Portfolio', status: 'active', version: '1.0.0', users: 234 },
    { id: '2', name: 'CRM', status: 'active', version: '2.1.0', users: 156 },
    { id: '3', name: 'Analytics', status: 'inactive', version: '1.5.0', users: 89 },
    { id: '4', name: 'AI Assistant', status: 'active', version: '1.2.0', users: 312 },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Apps</h2>
        <Button variant="primary">Install App</Button>
      </div>

      <Grid cols={2} gap={6}>
        {apps.map((app) => (
          <Card key={app.id}>
            <CardHeader
              title={app.name}
              subtitle={`v${app.version} • ${app.users} users`}
            />
            <CardContent>
              <div className="flex justify-between items-center">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  app.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {app.status}
                </span>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm">Configure</Button>
                  <Button variant="ghost" size="sm">Uninstall</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </Grid>
    </div>
  );
}