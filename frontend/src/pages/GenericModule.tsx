import { useAuth } from '../context/AuthContext';
import { mockData } from '../data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Filter, Search, FileText, Calendar, MoreHorizontal } from 'lucide-react';

export const GenericModule = ({ title, type }: { title: string, type: string }) => {
  const { role } = useAuth();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-border/40">
        <div>
          <Badge variant="outline" className="mb-2 bg-primary/5 text-primary border-primary/20 text-[10px] font-semibold tracking-wider">
            {type.toUpperCase()} MANAGEMENT
          </Badge>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            {title} Module
          </h1>
          <p className="text-muted-foreground mt-1 text-sm max-w-2xl">
            Streamline and manage all your {title.toLowerCase()} records efficiently with our comprehensive dashboard overview.
          </p>
        </div>
        {['faculty', 'hod', 'coordinator', 'both'].includes(role) && (
          <Button className="gap-2 shadow-sm hover:shadow-md transition-shadow">
            <Plus size={16} /> Create New {title}
          </Button>
        )}
      </div>

      {/* Main Content Card */}
      <Card className="min-h-[500px] border border-border/50 bg-card shadow-sm rounded-xl overflow-hidden">
        
        {/* Card Header & Actions */}
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 bg-muted/20 px-6 py-4">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            {type === 'events' ? <Calendar className="w-4 h-4 text-primary" /> : <FileText className="w-4 h-4 text-primary" />}
            Recent {title}
          </CardTitle>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-[250px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input type="text" placeholder={`Search ${title.toLowerCase()}...`} className="w-full pl-9 h-9 text-sm bg-background/50 border-border/50 focus:bg-background transition-colors" />
            </div>
            <Button variant="outline" size="sm" className="gap-2 h-9 bg-background/50 border-border/50">
              <Filter size={14} /> Filter
            </Button>
          </div>
        </CardHeader>

        {/* Card Body */}
        <CardContent className="p-0">
          {type === 'events' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {mockData.events.slice(0, 6).map((item, idx) => (
                <div key={idx} className="group flex flex-col p-5 bg-card border border-border/50 rounded-xl hover:border-primary/30 hover:shadow-md transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant="date">{item.date}</Badge>
                    <Badge variant="time">{item.time}</Badge>
                  </div>
                  <h4 className="text-lg font-bold mb-1.5 text-foreground group-hover:text-primary transition-colors">{item.title}</h4>
                  <p className="text-xs text-muted-foreground mb-5 flex-1 line-clamp-2">{item.description || item.venue}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <span className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">{item.venue}</span>
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-primary hover:text-primary hover:bg-primary/10 -mr-2">Details</Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/20">
                  <TableRow className="hover:bg-transparent border-b border-border/50">
                    {type === 'assignments' ? (
                      <>
                        <TableHead className="text-xs font-semibold text-muted-foreground h-10">Title</TableHead>
                        <TableHead className="text-xs font-semibold text-muted-foreground h-10">Subject</TableHead>
                        <TableHead className="text-xs font-semibold text-muted-foreground h-10">Deadline</TableHead>
                        <TableHead className="text-xs font-semibold text-muted-foreground text-right h-10">Marks</TableHead>
                        <TableHead className="w-[100px] h-10"></TableHead>
                      </>
                    ) : (
                      <>
                        <TableHead className="text-xs font-semibold text-muted-foreground h-10">Record ID</TableHead>
                        <TableHead className="text-xs font-semibold text-muted-foreground h-10">Details</TableHead>
                        <TableHead className="text-xs font-semibold text-muted-foreground h-10">Status</TableHead>
                        <TableHead className="w-[100px] h-10"></TableHead>
                      </>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {type === 'assignments' ? (
                    mockData.assignments.slice(0, 8).map((item, idx) => (
                      <TableRow key={idx} className="group hover:bg-muted/30 transition-colors border-b border-border/50">
                        <TableCell className="py-3">
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-foreground">{item.title}</span>
                            <span className="text-[11px] font-medium text-muted-foreground mt-0.5 line-clamp-1">{item.description}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs font-medium text-muted-foreground">
                          {mockData.subjects.find(s => s.id === item.subjectId)?.name || item.subjectId}
                        </TableCell>
                        <TableCell>
                          <Badge variant="date">
                            {item.deadline}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-xs font-semibold text-foreground">
                          {item.maxMarks}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end">
                            {['faculty', 'hod', 'coordinator', 'both'].includes(role) ? (
                              <Button variant="ghost" size="sm" className="h-7 text-xs opacity-0 group-hover:opacity-100 transition-opacity">View</Button>
                            ) : (
                              <Button size="sm" className="h-7 text-xs shadow-sm">Submit</Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    [1, 2, 3, 4, 5, 6].map((_, idx) => (
                      <TableRow key={idx} className="group hover:bg-muted/30 transition-colors border-b border-border/50">
                        <TableCell className="py-3">
                          <span className="text-xs font-mono font-medium text-muted-foreground">REQ-{idx + 1000}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-foreground">Sample {title} Record #{idx + 1}</span>
                            <span className="text-[11px] font-medium text-muted-foreground mt-0.5">Generated from mock data mapping.</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="active">
                            Active
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end">
                            <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground">
                              <MoreHorizontal size={14} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
