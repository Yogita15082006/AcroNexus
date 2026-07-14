import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockData } from '../data/mockData';
import { BookMarked, FileText, Calendar, Upload, Search, Download, RefreshCw, Eye, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import { toast } from 'sonner';export const AcademicResourcesModule = () => {
  const { role } = useAuth();
  const [activeTab, setActiveTab] = useState<'scheme' | 'syllabus' | 'timetable'>('scheme');
  const [searchQuery, setSearchQuery] = useState('');

  const [uploadDialog, setUploadDialog] = useState<{ isOpen: boolean; type: 'scheme' | 'syllabus' | 'timetable' | null, replaceId?: string }>({ isOpen: false, type: null });
  const [viewDocument, setViewDocument] = useState<any | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [localSchemes] = useState((mockData as any).uploadedSchemes || []);
  const [localSyllabus] = useState((mockData as any).uploadedSyllabus || []);
  const [localTimetables] = useState((mockData as any).uploadedTimetables || []);

  const filteredSchemes = localSchemes.map((s: any) => ({
    id: s.id,
    title: s.name,
    type: 'Scheme',
    semester: s.semester,
    updated: s.uploadDate,
    uploader: 'HOD',
    size: '1.5 MB'
  }));
  const filteredSyllabus = localSyllabus.map((s: any) => ({
    id: s.id,
    title: s.name,
    type: 'Syllabus',
    semester: s.semester,
    updated: s.uploadDate,
    uploader: 'HOD',
    size: '2.0 MB'
  }));
  const filteredTimetables = localTimetables.map((s: any) => ({
    id: s.id,
    title: s.name,
    type: 'Timetable',
    class: s.className,
    semester: s.semester,
    updated: s.uploadDate,
    uploader: 'Coordinator',
    size: '1.2 MB'
  }));

  const handleDownload = (doc: any) => {
    // Basic valid empty PDF structure for demonstration purposes
    const pdfContent = `%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n5 0 obj\n<< /Length 44 >>\nstream\nBT /F1 24 Tf 100 700 Td (Mock PDF Document) Tj ET\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000219 00000 n \n0000000305 00000 n \ntrailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n399\n%%EOF`;
    const blob = new Blob([pdfContent], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${doc.title.replace(/\s+/g, '_')}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`${doc.title} downloaded successfully.`);
  };

  const simulateUpload = (type: string, replaceId?: string) => {
    setIsUploading(true);
    toast.loading(replaceId ? `Replacing ${type}...` : `Uploading ${type}...`, { id: 'upload' });
    setTimeout(() => {
      setIsUploading(false);
      setUploadDialog({ isOpen: false, type: null });
      toast.success(replaceId ? `${type} replaced successfully!` : `${type} uploaded successfully!`, { id: 'upload' });
    }, 2000);
  };

  const renderDocumentList = (documents: any[]) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {documents.map((doc) => (
          <Card key={doc.id} className="border border-border/50 shadow-sm hover:shadow-md transition-all group overflow-hidden bg-card flex flex-col">
            <div className="h-2 bg-gradient-to-r from-primary/50 to-primary/20"></div>
            <CardHeader className="p-5 pb-3">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-semibold">
                  {doc.type}
                </Badge>
                {role !== 'student' && (
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10" 
                      title="Replace"
                      onClick={() => setUploadDialog({ isOpen: true, type: activeTab, replaceId: doc.id })}
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                )}
              </div>
              <CardTitle className="text-base font-bold text-foreground leading-tight">{doc.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0 flex-1 flex flex-col justify-between">
              <div className="space-y-2 mt-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground font-medium">Updated:</span>
                  <span className="text-foreground font-semibold">{doc.updated}</span>
                </div>
                {doc.semester && (
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground font-medium">Semester:</span>
                    <span className="text-foreground font-semibold">{doc.semester}</span>
                  </div>
                )}
                {doc.class && (
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground font-medium">Class:</span>
                    <span className="text-foreground font-semibold">{doc.class}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground font-medium">Uploaded by:</span>
                  <span className="text-foreground font-semibold">{doc.uploader}</span>
                </div>
              </div>
              
              <div className="mt-5 pt-4 border-t border-border/50 flex justify-between items-center">
                <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" /> {doc.size}
                </span>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-8 text-xs font-semibold px-3 rounded-full hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                    onClick={() => setViewDocument(doc)}
                  >
                    <Eye className="w-3.5 h-3.5 mr-1.5" /> View
                  </Button>
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="h-8 text-xs font-semibold px-3 rounded-full hover:bg-secondary/80 transition-colors"
                    onClick={() => handleDownload(doc)}
                  >
                    <Download className="w-3.5 h-3.5 mr-1.5" /> Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card border border-border/50 p-6 rounded-xl shadow-sm relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col gap-2 relative z-10">
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <BookMarked className="w-7 h-7 text-primary" />
            Academic Resources
          </h1>
          <p className="text-sm text-muted-foreground font-medium max-w-xl leading-relaxed">
            Access official university schemes, detailed semester syllabus, and class timetables.
            All resources are curated and maintained by the academic staff.
          </p>
        </div>
        
        {role !== 'student' && (
          <div className="flex items-center gap-3 relative z-10 shrink-0">
            <Button 
              className="shadow-sm bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all hover:scale-[1.02]"
              onClick={() => setUploadDialog({ isOpen: true, type: activeTab })}
            >
              <Upload className="w-4 h-4 mr-2" /> Upload {activeTab === 'scheme' ? 'Scheme' : activeTab === 'syllabus' ? 'Syllabus' : 'Timetable'}
            </Button>
          </div>
        )}
      </div>

      {/* Main Workspace */}
      <div className="space-y-6">
        
        {/* Navigation & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-background p-1.5 rounded-lg border border-border/50 shadow-sm">
          <div className="flex items-center w-full md:w-auto p-1 bg-muted/30 rounded-md">
            <button 
              onClick={() => setActiveTab('scheme')}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                activeTab === 'scheme' 
                  ? 'bg-background text-foreground shadow-sm ring-1 ring-border/50' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <FileText className="w-4 h-4" /> Schemes
            </button>
            <button 
              onClick={() => setActiveTab('syllabus')}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                activeTab === 'syllabus' 
                  ? 'bg-background text-foreground shadow-sm ring-1 ring-border/50' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <BookMarked className="w-4 h-4" /> Syllabus
            </button>
            <button 
              onClick={() => setActiveTab('timetable')}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                activeTab === 'timetable' 
                  ? 'bg-background text-foreground shadow-sm ring-1 ring-border/50' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Calendar className="w-4 h-4" /> Timetables
            </button>
          </div>
          
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder={`Search ${activeTab}...`} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-border/50 rounded-md pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Informational Alert for Students */}
        {role === 'student' && (
          <div className="flex gap-3 items-start p-4 bg-primary/5 rounded-lg border border-primary/20">
            <ShieldAlert className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-foreground">Read-Only Access</h4>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                You have view-only access to academic resources. Only staff can upload or replace official documents. Ensure you refer to the latest versions before classes.
              </p>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          {activeTab === 'scheme' && renderDocumentList(filteredSchemes)}
          {activeTab === 'syllabus' && renderDocumentList(filteredSyllabus)}
          {activeTab === 'timetable' && renderDocumentList(filteredTimetables)}
        </div>

      </div>

      {/* Upload Dialog */}
      <Dialog open={uploadDialog.isOpen} onOpenChange={(open) => !isUploading && setUploadDialog({ isOpen: open, type: null })}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{uploadDialog.replaceId ? 'Replace' : 'Upload'} {uploadDialog.type === 'scheme' ? 'Scheme' : uploadDialog.type === 'syllabus' ? 'Syllabus' : 'Timetable'}</DialogTitle>
            <DialogDescription>
              Select a PDF or document file to {uploadDialog.replaceId ? 'replace the existing' : 'upload as'} {uploadDialog.type}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="border-2 border-dashed border-border/60 rounded-xl p-8 flex flex-col items-center justify-center text-center relative hover:bg-muted/30 transition-colors cursor-pointer group">
              <div className="p-4 bg-muted/50 rounded-full mb-4 group-hover:scale-110 transition-transform">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <p className="text-sm font-semibold text-foreground mb-1">Click to browse or drag and drop</p>
              <p className="text-xs text-muted-foreground">PDF, DOCX, or XLSX (max 10MB)</p>
              <input 
                type="file" 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                onChange={() => uploadDialog.type && simulateUpload(uploadDialog.type, uploadDialog.replaceId)} 
                disabled={isUploading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setUploadDialog({ isOpen: false, type: null })} disabled={isUploading}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Document Modal */}
      <Dialog open={!!viewDocument} onOpenChange={(open) => !open && setViewDocument(null)}>
        <DialogContent className="sm:max-w-[800px] h-[85vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="p-6 border-b border-border/50 bg-muted/20">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <FileText className="w-5 h-5 text-primary" />
              {viewDocument?.title}
            </DialogTitle>
            <DialogDescription className="text-sm mt-1">
              {viewDocument?.type} • Uploaded by {viewDocument?.uploader} on {viewDocument?.updated}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 bg-background relative overflow-hidden flex flex-col">
            <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
              <div className="max-w-2xl mx-auto bg-card border border-border/50 rounded-lg shadow-sm p-8 min-h-full">
                <div className="border-b border-border/50 pb-6 mb-6 text-center">
                  <h2 className="text-2xl font-bold text-foreground mb-2">{viewDocument?.title}</h2>
                  <p className="text-muted-foreground font-medium">{viewDocument?.type} Document</p>
                </div>
                <div className="space-y-6">
                  <div className="bg-muted/30 p-5 rounded-md border border-border/50">
                    <h3 className="font-semibold mb-3 text-foreground">Document Details</h3>
                    <ul className="space-y-2.5 text-sm text-muted-foreground">
                      <li className="flex justify-between border-b border-border/50 pb-2">
                        <strong className="text-foreground">Subject/Class:</strong> 
                        <span>{viewDocument?.class || viewDocument?.title}</span>
                      </li>
                      <li className="flex justify-between border-b border-border/50 pb-2">
                        <strong className="text-foreground">Semester:</strong> 
                        <span>{viewDocument?.semester || 'N/A'}</span>
                      </li>
                      <li className="flex justify-between pb-1">
                        <strong className="text-foreground">File Size:</strong> 
                        <span>{viewDocument?.size}</span>
                      </li>
                    </ul>
                  </div>
                  <div className="p-8 border-2 border-dashed border-border/60 rounded-md text-center bg-muted/10 flex flex-col items-center justify-center min-h-[250px]">
                    <div className="p-4 bg-muted/50 rounded-full mb-4">
                      <FileText className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <p className="text-foreground font-semibold mb-1">Document Preview</p>
                    <p className="text-sm text-muted-foreground max-w-sm">In a production environment, this would render the actual PDF document using a viewer component.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-border/50 bg-muted/20 flex justify-end gap-3 shrink-0">
              <Button variant="ghost" onClick={() => setViewDocument(null)}>Close</Button>
              <Button 
                onClick={() => handleDownload(viewDocument)} 
                className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
              >
                <Download className="w-4 h-4" /> Download PDF
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
