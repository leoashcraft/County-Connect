import React, { useState } from "react";
import { Store } from "@/api/entities";
import { User } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function MigrateStoreSlugs() {
  const navigate = useNavigate();
  const [migrating, setMigrating] = useState(false);
  const [results, setResults] = useState([]);
  const [complete, setComplete] = useState(false);

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const migrateStores = async () => {
    setMigrating(true);
    setResults([]);

    try {
      const user = await User.me();
      if (user.role !== 'admin') {
        alert('Only admins can run migrations');
        navigate(createPageUrl("Marketplace"));
        return;
      }

      const stores = await Store.list();
      const migrationResults = [];

      for (const store of stores) {
        try {
          if (!store.slug || store.slug === 'undefined') {
            const newSlug = generateSlug(store.name);
            
            // Check if slug already exists
            const existingStore = stores.find(s => s.slug === newSlug && s.id !== store.id);
            const finalSlug = existingStore ? `${newSlug}-${store.id.slice(-4)}` : newSlug;
            
            await Store.update(store.id, { slug: finalSlug });
            migrationResults.push({
              name: store.name,
              slug: finalSlug,
              status: 'success'
            });
          } else {
            migrationResults.push({
              name: store.name,
              slug: store.slug,
              status: 'skipped'
            });
          }
        } catch (error) {
          migrationResults.push({
            name: store.name,
            status: 'error',
            error: error.message
          });
        }
      }

      setResults(migrationResults);
      setComplete(true);
    } catch (error) {
      alert(`Migration failed: ${error.message}`);
    }

    setMigrating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="border-2 border-orange-100">
          <CardHeader>
            <CardTitle>Migrate Store Slugs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                This migration will add URL-friendly slugs to all stores that don't have them yet.
                This only needs to be run once.
              </p>
            </div>

            {!complete && (
              <Button
                onClick={migrateStores}
                disabled={migrating}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
              >
                {migrating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Migrating Stores...
                  </>
                ) : (
                  'Start Migration'
                )}
              </Button>
            )}

            {results.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Migration Results:</h3>
                {results.map((result, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{result.name}</p>
                      {result.slug && (
                        <p className="text-sm text-gray-500">Slug: {result.slug}</p>
                      )}
                      {result.error && (
                        <p className="text-sm text-red-600">Error: {result.error}</p>
                      )}
                    </div>
                    {result.status === 'success' && (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Migrated
                      </Badge>
                    )}
                    {result.status === 'skipped' && (
                      <Badge className="bg-gray-100 text-gray-800">Skipped</Badge>
                    )}
                    {result.status === 'error' && (
                      <Badge className="bg-red-100 text-red-800">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Error
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}

            {complete && (
              <div className="text-center space-y-4">
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                  <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-600" />
                  <p className="text-green-900 font-semibold">Migration Complete!</p>
                  <p className="text-sm text-green-700 mt-1">All stores now have slugs</p>
                </div>
                <Button
                  onClick={() => navigate(createPageUrl("Marketplace"))}
                  variant="outline"
                >
                  Go to Marketplace
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}