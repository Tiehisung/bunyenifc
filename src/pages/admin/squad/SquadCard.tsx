import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Users, CalendarDays, MapPin, Clock, UserCog } from "lucide-react";
import { ISquad } from "./page";
import { formatDate, getTimeAgo } from "@/lib/timeAndDate";
import { ConfirmActionButton } from "@/components/buttons/ConfirmAction";
import { IMatch } from "@/types/match.interface";
import { useDeleteSquadMutation } from "@/services/squad.endpoints";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { dummyUser } from "@/data/user";

interface SquadDisplayProps {
  squad?: ISquad;
  match?: IMatch;
}

const SquadCard = ({ squad, match }: SquadDisplayProps) => {
  const user = dummyUser;
  const navigate = useNavigate();
  const [deleteSquad] = useDeleteSquadMutation();

  if (!squad) {
    return <div className="_label text-center m-6">Squad not found</div>;
  }

  const handleDelete = async () => {
    try {
      const result = await deleteSquad(squad._id || "").unwrap();
      if (result.success) {
        toast.success(result.message);
        navigate(0);
      }
    } catch (error) {
      toast.error("Failed to delete squad");
    }
  };

  return (
    <Card className="shadow-lg border-0 overflow-hidden rounded-none ml-2.5 mb-12">
      <CardHeader className="bg-muted/40 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">
              Match Squad | {squad?.title ?? "Unknown"}
            </CardTitle>
            <CardDescription className="flex flex-wrap items-center gap-3 mt-1 text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin size={16} />{" "}
                {(squad?.match?.isHome ?? match?.isHome) ? "Home" : "Away"}
              </span>
              <span className="flex items-center gap-1">
                <CalendarDays size={16} />{" "}
                {formatDate(squad?.match?.date ?? match?.date, "March 2, 2025")}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={16} /> {squad?.match?.time ?? match?.time}
              </span>
            </CardDescription>
          </div>
        </div>

        {squad?.description && (
          <p className="mt-3 text-sm text-muted-foreground italic">
            “{squad?.description}”
          </p>
        )}
      </CardHeader>

      <CardContent className="py-6">
        {/* Players Section */}
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
          <Users size={18} /> Players ({squad?.players?.length})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {squad?.players?.map((player) => (
            <div
              key={player?._id}
              className="flex items-center gap-3 bg-muted/30 p-3 rounded-xl border border-border hover:shadow-md transition"
            >
              <Avatar className="h-12 w-12">
                <AvatarImage src={player?.avatar} alt={player?.name} />
                <AvatarFallback>
                  {player?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-semibold text-sm uppercase">
                  {player?.name}
                </span>
                <Badge variant="outline" className="text-xs mt-1 capitalize">
                  {player?.position}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-6" />

        {/* Technical Team */}
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
          <UserCog size={18} /> Technical Leadership
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Coach */}
          <div className="flex items-center gap-3 bg-muted/30 p-3 rounded-xl border border-border">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={squad?.coach?.avatar}
                alt={squad?.coach?.name}
              />
              <AvatarFallback>
                {squad?.coach?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold">
                {squad?.coach?.name || "N/A"}
              </span>
              <Badge variant="secondary" className="text-xs mt-1">
                Coach
              </Badge>
            </div>
          </div>

          {/* Assistant */}
          <div className="flex items-center gap-3 bg-muted/30 p-3 rounded-xl border border-border">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={squad?.assistant?.avatar}
                alt={squad?.assistant?.name}
              />
              <AvatarFallback>
                {squad?.assistant?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold">
                {squad?.assistant?.name || "N/A"}
              </span>
              <Badge variant="secondary" className="text-xs mt-1">
                Assistant Coach
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="justify-between text-sm text-muted-foreground">
        <p>
          Created on {formatDate(squad?.createdAt)} (
          {getTimeAgo(squad?.createdAt as string)})
        </p>

        {user?.role?.includes("admin") && (
          <ConfirmActionButton
            primaryText="Delete Squad"
            onConfirm={handleDelete}
            variant="destructive"
            title="Delete Squad"
            confirmText={`Are you sure you want to delete "${squad?.title}" Squad?`}
          />
        )}
      </CardFooter>
    </Card>
  );
};

export default SquadCard;
