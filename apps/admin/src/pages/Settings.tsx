import { Card, CardHeader, CardContent, Button, Input } from '@pv/ui';

export function Settings() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Settings</h2>

      <div className="space-y-6">
        <Card>
          <CardHeader title="General Settings" subtitle="Platform configuration" />
          <CardContent>
            <div className="space-y-4">
              <Input label="Platform Name" defaultValue="PV Platform" />
              <Input label="Support Email" type="email" defaultValue="support@pvplatform.com" />
              <Input label="API URL" defaultValue="http://localhost:3000" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="AI Configuration" subtitle="AI provider settings" />
          <CardContent>
            <div className="space-y-4">
              <Input label="AI Provider" defaultValue="gemini" />
              <Input label="API Key" type="password" defaultValue="••••••••••••••••" />
              <div className="flex gap-2">
                <Button variant="primary">Save Changes</Button>
                <Button variant="secondary">Test Connection</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Database" subtitle="Database connection settings" />
          <CardContent>
            <div className="space-y-4">
              <Input label="MongoDB URI" type="password" defaultValue="mongodb://localhost:27017/pv_platform" />
              <Button variant="primary">Test Connection</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}