import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { CheckCircle, XCircle, Eye, Loader2, FileText, User } from "lucide-react";
import PageHeader from "@/components/PageHeader";

interface PendingUser {
  id: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  aadhaarUrl: string;
  panUrl: string;
  profilePhotoUrl: string;
  approved: boolean;
  active: boolean;
  documents?: { type: string; url: string }[];
}

const PendingVerifications = () => {
  const navigate = useNavigate();
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingDocument, setViewingDocument] = useState<{ type: string; url: string } | null>(null);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "ADMIN") {
      navigate("/admin/login");
      return;
    }
    fetchPendingUsers();
  }, [navigate]);

  const fetchPendingUsers = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:8080/api/admin/pending-users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setPendingUsers(data);
      } else {
        toast.error("Failed to fetch pending users");
      }
    } catch (error) {
      toast.error("Error fetching pending users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDocuments = (user: PendingUser) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const openDocumentPreview = (type: string, url: string) => {
    setViewingDocument({ type, url });
  };

  const handleApprove = async (userId: string) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:8080/api/admin/users/${userId}/documents/approve`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast.success("User approved successfully!");
        fetchPendingUsers();
        setIsModalOpen(false);
      } else {
        toast.error("Failed to approve user");
      }
    } catch (error) {
      toast.error("Error approving user");
    }
  };

  const handleReject = async (userId: string) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:8080/api/admin/users/${userId}/documents/reject`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast.success("User rejected successfully");
        fetchPendingUsers();
        setIsModalOpen(false);
      } else {
        toast.error("Failed to reject user");
      }
    } catch (error) {
      toast.error("Error rejecting user");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading pending verifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background">
      <PageHeader title="Pending Verifications" showBack backTo="/admin/dashboard" />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Page Title */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-xl bg-primary/10">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Pending Verifications
              </h1>
              <p className="text-muted-foreground">Review and approve user documents</p>
            </div>
          </div>
        </div>

        <Card className="shadow-soft border-2 animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              Users Awaiting Verification
            </CardTitle>
            <CardDescription>
              {pendingUsers.length} user(s) pending document verification
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingUsers.length === 0 ? (
              <div className="text-center py-16">
                <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
                <p className="text-xl font-medium mb-2">All Caught Up!</p>
                <p className="text-muted-foreground">No pending verifications at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingUsers.map((user, index) => (
                  <Card
                    key={user.id}
                    className="border hover:shadow-md transition-all hover:border-primary/30 animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0">
                          <User className="h-7 w-7 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg truncate">{user.username}</h3>
                          <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                          <p className="text-sm text-muted-foreground">{user.phone}</p>
                          <Badge variant="outline" className="mt-2">
                            {user.role}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleViewDocuments(user)}
                        className="w-full mt-4 gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View Documents
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Document Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Review Documents - {selectedUser?.username}
            </DialogTitle>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6">
              {/* User Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">User Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedUser.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{selectedUser.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Role</p>
                    <Badge>{selectedUser.role}</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Documents */}
              {selectedUser.documents && selectedUser.documents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {selectedUser.documents.map((doc, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-lg">{doc.type}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4">
                          <img
                            src={doc.url}
                            alt={doc.type}
                            className="h-32 w-auto rounded-lg border shadow-sm object-cover"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDocumentPreview(doc.type, doc.url)}
                            className="gap-2"
                          >
                            <Eye className="h-4 w-4" />
                            View Full Size
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No uploaded documents</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-4 pt-4 border-t">
                <Button variant="outline" onClick={() => handleReject(selectedUser.id)} className="gap-2">
                  <XCircle className="h-4 w-4" />
                  Reject
                </Button>
                <Button onClick={() => handleApprove(selectedUser.id)} className="gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Approve
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Full Image Preview */}
      <Dialog open={!!viewingDocument} onOpenChange={() => setViewingDocument(null)}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>{viewingDocument?.type}</DialogTitle>
          </DialogHeader>
          {viewingDocument && (
            <div className="flex justify-center">
              <img
                src={viewingDocument.url}
                alt={viewingDocument.type}
                className="max-w-full max-h-[70vh] rounded-lg object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PendingVerifications;
