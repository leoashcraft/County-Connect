import React, { useState } from "react";
import {
  Church, Restaurant, School, FoodTruck, Attraction,
  RealtyListing, CommunityResource, SportsTeam, Town
} from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Loader2, Database } from "lucide-react";
import { generateSlug } from "@/utils/slugUtils";

/**
 * Migration page to add slugs to all existing entities
 * Run this once to update existing data with SEO-friendly slugs
 */
export default function MigrateEntitySlugs() {
  const [migrating, setMigrating] = useState(false);
  const [results, setResults] = useState([]);
  const [townsMap, setTownsMap] = useState({});

  const entityTypes = [
    { name: "Churches", Entity: Church, townField: "town_id" },
    { name: "Restaurants", Entity: Restaurant, townField: "town_id" },
    { name: "Schools", Entity: School, townField: "town_id" },
    { name: "Food Trucks", Entity: FoodTruck, townField: "home_base_town_id" },
    { name: "Attractions", Entity: Attraction, townField: "town_id" },
    { name: "Realty Listings", Entity: RealtyListing, townField: "town_id" },
    { name: "Community Resources", Entity: CommunityResource, townField: "town_id" },
    { name: "Sports Teams", Entity: SportsTeam, townField: "town_id" }
  ];

  const loadTowns = async () => {
    const towns = await Town.list();
    const map = {};
    towns.forEach(town => {
      map[town.id] = {
        name: town.name,
        slug: town.slug || generateSlug(town.name)
      };
    });
    setTownsMap(map);
    return map;
  };

  const migrateEntity = async (entityType, towns) => {
    const { name, Entity, townField } = entityType;
    const result = { name, total: 0, updated: 0, skipped: 0, errors: [] };

    try {
      const entities = await Entity.list();
      result.total = entities.length;

      for (const entity of entities) {
        try {
          // Skip if already has slug
          if (entity.slug && entity.town_slug) {
            result.skipped++;
            continue;
          }

          // Generate slug from name
          const slug = generateSlug(entity.name || entity.title || entity.address);

          // Get town slug
          const townId = entity[townField];
          const townSlug = townId && towns[townId]
            ? towns[townId].slug
            : generateSlug(entity.town || '');

          // Update entity
          await Entity.update(entity.id, {
            slug,
            town_slug: townSlug
          });

          result.updated++;
        } catch (error) {
          result.errors.push(`${entity.id}: ${error.message}`);
        }
      }
    } catch (error) {
      result.errors.push(`Failed to load ${name}: ${error.message}`);
    }

    return result;
  };

  const runMigration = async () => {
    setMigrating(true);
    setResults([]);

    // First, migrate towns to have slugs
    try {
      const towns = await Town.list();
      for (const town of towns) {
        if (!town.slug) {
          await Town.update(town.id, {
            slug: generateSlug(town.name)
          });
        }
      }
    } catch (error) {
      console.error("Error migrating towns:", error);
    }

    // Load towns map
    const towns = await loadTowns();

    // Migrate each entity type
    const allResults = [];
    for (const entityType of entityTypes) {
      const result = await migrateEntity(entityType, towns);
      allResults.push(result);
      setResults([...allResults]);
    }

    setMigrating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="border-2 border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-6 h-6 text-orange-600" />
              Migrate Entity Slugs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">What this does:</h3>
              <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                <li>Adds URL-friendly slugs to all existing entities</li>
                <li>Enables SEO-friendly URLs like /church/corsicana/first-baptist-church</li>
                <li>Skips entities that already have slugs</li>
                <li>Safe to run multiple times</li>
              </ul>
            </div>

            <Button
              onClick={runMigration}
              disabled={migrating}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            >
              {migrating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Migrating...
                </>
              ) : (
                <>
                  <Database className="w-4 h-4 mr-2" />
                  Run Migration
                </>
              )}
            </Button>

            {results.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Migration Results</h3>

                {results.map((result, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border-2 ${
                      result.errors.length > 0
                        ? 'border-red-200 bg-red-50'
                        : 'border-green-200 bg-green-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium flex items-center gap-2">
                        {result.errors.length === 0 ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-600" />
                        )}
                        {result.name}
                      </h4>
                      <div className="flex gap-2">
                        <Badge variant="outline">Total: {result.total}</Badge>
                        <Badge className="bg-green-100 text-green-800">Updated: {result.updated}</Badge>
                        <Badge variant="secondary">Skipped: {result.skipped}</Badge>
                      </div>
                    </div>

                    {result.errors.length > 0 && (
                      <div className="mt-2 text-sm text-red-700">
                        <p className="font-medium">Errors:</p>
                        <ul className="list-disc list-inside">
                          {result.errors.slice(0, 5).map((err, i) => (
                            <li key={i}>{err}</li>
                          ))}
                          {result.errors.length > 5 && (
                            <li>...and {result.errors.length - 5} more</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
