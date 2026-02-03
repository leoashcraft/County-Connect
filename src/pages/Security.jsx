import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Lock, 
  Eye, 
  Key, 
  Database, 
  RefreshCw, 
  CheckCircle,
  AlertTriangle
} from "lucide-react";

export default function SecurityPage() {
  const securityFeatures = [
    {
      icon: Lock,
      title: "Secure Authentication",
      description: "Local OAuth 2.0 authentication with Google integration and secure session management",
      status: "active",
      color: "text-green-600"
    },
    {
      icon: Shield,
      title: "CSRF Protection",
      description: "Cross-Site Request Forgery prevention built into the platform",
      status: "active",
      color: "text-green-600"
    },
    {
      icon: Eye,
      title: "XSS Prevention",
      description: "React's automatic XSS protection plus content sanitization",
      status: "active",
      color: "text-green-600"
    },
    {
      icon: Key,
      title: "OAuth Security",
      description: "Secure token-based authentication with OAuth 2.0 providers (Google)",
      status: "active",
      color: "text-green-600"
    },
    {
      icon: Database,
      title: "SQL Injection Prevention",
      description: "Parameterized queries and ORM protection at platform level",
      status: "active",
      color: "text-green-600"
    },
    {
      icon: RefreshCw,
      title: "Rate Limiting",
      description: "Login attempt rate limiting to prevent brute-force attacks",
      status: "active",
      color: "text-green-600"
    },
    {
      icon: Shield,
      title: "Clickjacking Protection",
      description: "X-Frame-Options headers prevent iframe embedding on unauthorized domains",
      status: "active",
      color: "text-green-600"
    },
    {
      icon: CheckCircle,
      title: "HTTPS Encryption",
      description: "All data transmitted over secure HTTPS connections",
      status: "active",
      color: "text-green-600"
    }
  ];

  const dataProtection = [
    {
      title: "User Data Encryption",
      description: "All sensitive user data is encrypted at rest and in transit"
    },
    {
      title: "Role-Based Access Control",
      description: "Admin and user roles with restricted permissions ensure proper access control"
    },
    {
      title: "Secure File Uploads",
      description: "Files are validated, sanitized, and stored securely with access controls"
    },
    {
      title: "Session Management",
      description: "Secure session handling with automatic timeout and token refresh"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-10 h-10 text-orange-600" />
            <h1 className="text-3xl font-bold text-gray-900">Security Features</h1>
          </div>
          <p className="text-gray-600">
            LocalMarket is built with security as a top priority. Our platform implements
            industry-standard security measures with local authentication and OAuth integration
            to protect your data and ensure safe transactions.
          </p>
        </div>

        {/* Security Status Banner */}
        <Card className="border-2 border-green-200 bg-green-50 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <h3 className="text-lg font-bold text-green-900">All Security Features Active</h3>
                <p className="text-green-700 text-sm">Your marketplace is protected by multiple layers of security</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Features Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Measures</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {securityFeatures.map((feature, index) => (
              <Card key={index} className="border-2 border-orange-100">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <feature.icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-gray-900">{feature.title}</h3>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Data Protection */}
        <Card className="border-2 border-orange-100 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-6 h-6 text-orange-600" />
              Data Protection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {dataProtection.map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Best Practices */}
        <Card className="border-2 border-blue-100 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <AlertTriangle className="w-6 h-6" />
              Security Best Practices for Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>Use a strong, unique password for your Google account</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>Enable two-factor authentication on your Google account</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>Never share your login credentials with anyone</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>Log out when using shared or public computers</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>Report any suspicious activity immediately</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>Verify seller information before making purchases</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Technical Details */}
        <Card className="border-2 border-orange-100 mt-8">
          <CardHeader>
            <CardTitle>Technical Security Stack</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Authentication</h4>
                <p className="text-sm text-gray-600">Local OAuth 2.0 with Google</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Transport</h4>
                <p className="text-sm text-gray-600">HTTPS/TLS 1.3</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Framework</h4>
                <p className="text-sm text-gray-600">React 18 with XSS Protection</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Database</h4>
                <p className="text-sm text-gray-600">Encrypted with parameterized queries</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Headers</h4>
                <p className="text-sm text-gray-600">X-Frame-Options, CSP, HSTS</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Monitoring</h4>
                <p className="text-sm text-gray-600">Real-time threat detection</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}