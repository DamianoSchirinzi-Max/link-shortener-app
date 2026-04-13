import { auth } from "@clerk/nextjs/server";
import { getLinksByUserId } from "@/data/links";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Link2 } from "lucide-react";
import { CreateLinkDialog } from "@/components/links/create-link-dialog";
import { EditLinkDialog } from "@/components/links/edit-link-dialog";
import { DeleteLinkDialog } from "@/components/links/delete-link-dialog";

export default async function DashboardPage() {
  const { userId } = await auth();
  const links = await getLinksByUserId(userId!);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Your Links</h1>
        <CreateLinkDialog />
      </div>

      {links.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Link2 className="h-10 w-10 mb-3" />
            <p className="text-lg font-medium">No links yet</p>
            <p className="text-sm">
              Create your first short link to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {links.map((link) => (
            <Card key={link.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-4">
                  <CardTitle className="text-base font-semibold truncate">
                    /{link.shortCode}
                  </CardTitle>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <div>
                      <EditLinkDialog link={link} />
                      <DeleteLinkDialog link={link} />
                    </div>
                    <Badge variant="secondary">
                      {new Date(link.createdAt).toLocaleDateString()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground truncate transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{link.url}</span>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
