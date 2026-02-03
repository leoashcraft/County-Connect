import React, { useState, useEffect } from "react";
import { SportsTeam, User, Event } from "@/api/entities";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Trophy, MapPin, Phone, Globe, ArrowLeft, Edit,
  Mail, Users, Calendar, School, Facebook, Instagram, Twitter
} from "lucide-react";
import ClaimPageBanner from "@/components/ClaimPageBanner";
import { SafeEmail } from "@/components/utils/emailObfuscation";
import MetaTags from "@/components/seo/MetaTags";
import JsonLdSchema from "@/components/seo/JsonLdSchema";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function SportsTeamDetail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { townSlug, teamSlug } = useParams();
  const queryId = searchParams.get("id");
  const [teamId, setTeamId] = useState(queryId);
  const [team, setTeam] = useState(null);
  const [user, setUser] = useState(null);
  const [upcomingGames, setUpcomingGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const { settings } = useSiteSettings();

  useEffect(() => {
    loadData();
  }, [queryId, townSlug, teamSlug]);

  const loadData = async () => {
    try {
      const userData = await User.me().catch(() => null);
      setUser(userData);

      let teamData = null;
      let resolvedId = queryId;

      // Try slug-based routing first
      if (townSlug && teamSlug) {
        const teams = await SportsTeam.filter({ slug: teamSlug, town_slug: townSlug });
        if (teams.length > 0) {
          teamData = teams[0];
          resolvedId = teamData.id;
        }
      }
      // Fall back to ID-based routing
      else if (queryId) {
        teamData = await SportsTeam.get(queryId);
      }

      if (teamData) {
        setTeam(teamData);
        setTeamId(resolvedId);

        // Load upcoming games for this team
        const events = await Event.filter({
          organizer_id: resolvedId,
          event_type: 'sports',
          status: 'active'
        }, 'event_date');
        setUpcomingGames(events.slice(0, 5));
      }
    } catch (error) {
      console.error("Error loading team:", error);
    }
    setLoading(false);
  };

  const sports = {
    football: "Football",
    basketball: "Basketball",
    baseball: "Baseball",
    softball: "Softball",
    soccer: "Soccer",
    volleyball: "Volleyball",
    tennis: "Tennis",
    golf: "Golf",
    track: "Track & Field",
    cross_country: "Cross Country",
    swimming: "Swimming",
    wrestling: "Wrestling",
    cheer: "Cheer/Dance",
    esports: "eSports",
    other: "Other"
  };

  const levels = {
    youth: "Youth League",
    middle_school: "Middle School",
    high_school: "High School",
    college: "College",
    adult: "Adult League",
    recreational: "Recreational",
    travel: "Travel/Select",
    club: "Club"
  };

  const getLevelColor = (level) => {
    const colors = {
      youth: "bg-green-100 text-green-800",
      middle_school: "bg-blue-100 text-blue-800",
      high_school: "bg-purple-100 text-purple-800",
      college: "bg-orange-100 text-orange-800",
      adult: "bg-gray-100 text-gray-800",
      recreational: "bg-teal-100 text-teal-800",
      travel: "bg-red-100 text-red-800",
      club: "bg-indigo-100 text-indigo-800"
    };
    return colors[level] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
      <Trophy className="w-12 h-12 text-emerald-600 animate-pulse" />
    </div>;
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
        <div className="max-w-4xl mx-auto text-center py-12">
          <Trophy className="w-20 h-20 mx-auto mb-6 text-gray-300" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Team not found</h2>
          <Button onClick={() => navigate(createPageUrl("SportsTeams"))}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Teams
          </Button>
        </div>
      </div>
    );
  }

  const canEdit = user && (user.id === team.owner_id || user.id === team.created_by || user.role === 'admin');

  return (
    <>
      <MetaTags
        title={`${team.name} - ${team.sport || 'Sports Team'} in ${settings.county_name || 'Navarro'} County`}
        description={team.description || `Learn more about ${team.name}, a ${team.sport || 'sports'} team in ${settings.county_name || 'Navarro'} County.`}
      />
      <JsonLdSchema type="sportsTeam" data={team} />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(createPageUrl("SportsTeams"))}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Teams
        </Button>

        <ClaimPageBanner
          entityType="SportsTeam"
          entityId={team.id}
          entityName={team.name}
          ownerId={team.owner_id}
          user={user}
        />

        <div className="grid gap-6">
          {/* Header Card */}
          <Card className="border-2 border-emerald-100 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {team.logo_url && (
                  <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <img
                      src={team.logo_url}
                      alt={team.name}
                      className="max-h-full max-w-full object-contain p-2"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-emerald-100 text-emerald-800">
                          {sports[team.sport] || team.sport}
                        </Badge>
                        <Badge className={getLevelColor(team.level)}>
                          {levels[team.level] || team.level}
                        </Badge>
                      </div>
                      <h1 className="text-3xl font-bold text-gray-900">{team.name}</h1>
                      {team.organization && (
                        <p className="text-lg text-gray-600 mt-1 flex items-center gap-2">
                          <School className="w-5 h-5" />
                          {team.organization}
                        </p>
                      )}
                    </div>
                    {canEdit && (
                      <Button
                        variant="outline"
                        onClick={() => navigate(createPageUrl(`EditSportsTeam?id=${team.id}`))}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    )}
                  </div>

                  {/* Record & Season */}
                  <div className="flex flex-wrap gap-4 mb-4">
                    {team.record && (
                      <div className="bg-emerald-50 px-4 py-2 rounded-lg">
                        <p className="text-xs text-gray-500">Record</p>
                        <p className="text-lg font-bold text-emerald-700">{team.record}</p>
                      </div>
                    )}
                    {team.season && (
                      <div className="bg-gray-50 px-4 py-2 rounded-lg">
                        <p className="text-xs text-gray-500">Season</p>
                        <p className="text-lg font-semibold">{team.season}</p>
                      </div>
                    )}
                    {team.age_group && (
                      <div className="bg-gray-50 px-4 py-2 rounded-lg">
                        <p className="text-xs text-gray-500">Age Group</p>
                        <p className="text-lg font-semibold">{team.age_group}</p>
                      </div>
                    )}
                  </div>

                  {team.description && (
                    <p className="text-gray-600">{team.description}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact & Location */}
          <Card className="border-2 border-emerald-100">
            <CardHeader>
              <CardTitle>Contact & Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {team.town && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-5 h-5 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-gray-600">{team.town}</p>
                      {team.home_field && (
                        <p className="text-sm text-gray-500">Home: {team.home_field}</p>
                      )}
                    </div>
                  </div>
                )}
                {team.coach_name && (
                  <div className="flex items-start gap-2">
                    <Users className="w-5 h-5 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Head Coach</p>
                      <p className="text-gray-600">{team.coach_name}</p>
                    </div>
                  </div>
                )}
                {team.contact_email && (
                  <div className="flex items-start gap-2">
                    <Mail className="w-5 h-5 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Email</p>
                      <SafeEmail email={team.contact_email} className="text-emerald-600" />
                    </div>
                  </div>
                )}
                {team.contact_phone && (
                  <div className="flex items-start gap-2">
                    <Phone className="w-5 h-5 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <a href={`tel:${team.contact_phone}`} className="text-emerald-600 hover:underline">
                        {team.contact_phone}
                      </a>
                    </div>
                  </div>
                )}
                {team.website && (
                  <div className="flex items-start gap-2">
                    <Globe className="w-5 h-5 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Website</p>
                      <a
                        href={team.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Social Links */}
              {(team.facebook_url || team.instagram_url || team.twitter_url) && (
                <div className="flex gap-4 mt-4 pt-4 border-t">
                  {team.facebook_url && (
                    <a
                      href={team.facebook_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:underline"
                    >
                      <Facebook className="w-4 h-4" />
                      Facebook
                    </a>
                  )}
                  {team.instagram_url && (
                    <a
                      href={team.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-pink-600 hover:underline"
                    >
                      <Instagram className="w-4 h-4" />
                      Instagram
                    </a>
                  )}
                  {team.twitter_url && (
                    <a
                      href={team.twitter_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sky-600 hover:underline"
                    >
                      <Twitter className="w-4 h-4" />
                      Twitter/X
                    </a>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Roster */}
          {team.roster && team.roster.length > 0 && (
            <Card className="border-2 border-emerald-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-600" />
                  Roster
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-2">
                  {team.roster.map((player, idx) => (
                    <div key={idx} className="p-2 bg-gray-50 rounded flex items-center gap-2">
                      {player.number && (
                        <span className="w-8 h-8 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center text-sm font-bold">
                          {player.number}
                        </span>
                      )}
                      <div>
                        <p className="font-medium">{player.name}</p>
                        {player.position && (
                          <p className="text-xs text-gray-500">{player.position}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Schedule / Upcoming Games */}
          {team.schedule && team.schedule.length > 0 && (
            <Card className="border-2 border-emerald-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {team.schedule.map((game, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {game.home ? 'vs' : '@'} {game.opponent}
                        </p>
                        <p className="text-sm text-gray-600">{game.date} {game.time && `at ${game.time}`}</p>
                        {game.location && (
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {game.location}
                          </p>
                        )}
                      </div>
                      {game.result && (
                        <Badge variant={game.result.includes('W') ? 'default' : 'secondary'}>
                          {game.result}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Registration Info */}
          {team.registration_info && (
            <Card className="border-2 border-emerald-100">
              <CardHeader>
                <CardTitle>Registration Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 whitespace-pre-wrap">{team.registration_info}</p>
                {team.registration_url && (
                  <Button
                    className="mt-4 bg-gradient-to-r from-emerald-500 to-teal-500"
                    onClick={() => window.open(team.registration_url, '_blank')}
                  >
                    Register Now
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
