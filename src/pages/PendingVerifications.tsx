import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { CheckCircle, XCircle, Eye, Loader2, FileText, User, ArrowLeft } from "lucide-react";

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

  documents?: { type: string; url: string }[]; // NEW
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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate("/admin/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-primary" />
              <div>
                <CardTitle className="text-2xl">Pending Verifications</CardTitle>
                <CardDescription>Review and approve user documents</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {pendingUsers.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg text-muted-foreground">No pending verifications</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingUsers.map((user) => (
                  <Card key={user.id} className="border hover:shadow-md transition">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{user.username}</h3>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <p className="text-sm text-muted-foreground">{user.phone}</p>
                            <Badge variant="outline" className="mt-1">
                              {user.role}
                            </Badge>
                          </div>
                        </div>
                        <Button onClick={() => handleViewDocuments(user)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Documents
                        </Button>
                      </div>
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
            <DialogTitle>Review Documents - {selectedUser?.username}</DialogTitle>
          </DialogHeader>

          {selectedUser && (
            <>
              {/* ⭐ User Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">User Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <p><strong>Email:</strong> {selectedUser.email}</p>
                  <p><strong>Phone:</strong> {selectedUser.phone}</p>
                  <p><strong>Role:</strong> {selectedUser.role}</p>
                </CardContent>
              </Card>

              {/* ⭐ Dynamic Documents */}
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
                            className="h-32 w-auto rounded-lg border shadow-sm"
                          />

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDocumentPreview(doc.type, doc.url)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Full Size
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-6">
                  No uploaded documents
                </p>
              )}

              {/* ⭐ Actions */}
              <div className="flex justify-end gap-4 mt-6">
                <Button variant="outline" onClick={() => handleReject(selectedUser.id)}>
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button onClick={() => handleApprove(selectedUser.id)}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </div>
            </>
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
              <img src={viewingDocument.url} className="max-w-full max-h-[70vh] rounded-lg object-contain" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PendingVerifications;
