"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProjectBtn from "@/components/ProjectBtn";

interface Project {
  imageUrl: string;
  name: string;
  date: string;
  diagramsCount: number;
  description?: string;
  link: string;
  diagrams: { name: string }[];
}

export default function MePage() {
  const router = useRouter();
  const [user] = useState({
    name: "John Doe",
    email: "john@example.com",
    bio: "Frontend Developer | React Enthusiast",
  });

  const [projects, setProjects] = useState<Project[]>([
    {
      imageUrl: "https://via.placeholder.com/150",
      name: "Portfolio Site",
      date: "2025-01-15",
      diagramsCount: 2,
      description: "Personal website",
      link: "/project/portfolio-site",
      diagrams: [{ name: "Flowchart" }, { name: "Wireframe" }],
    },
    {
      imageUrl: "https://via.placeholder.com/150",
      name: "E-commerce App",
      date: "2025-02-01",
      diagramsCount: 3,
      description: "Shopping platform",
      link: "/project/e-commerce-app",
      diagrams: [{ name: "ERD" }, { name: "UML" }, { name: "Sitemap" }],
    },
  ]);

  const [newProject, setNewProject] = useState({ name: "", description: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "date">("date");

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const projectSlug = newProject.name.toLowerCase().replace(/\s+/g, "-");
    const newProjectData: Project = {
      imageUrl: "https://via.placeholder.com/150", // Default image
      name: newProject.name,
      date: new Date().toISOString().split("T")[0],
      diagramsCount: 0,
      description: newProject.description,
      link: `/project/${projectSlug}`,
      diagrams: [],
    };
    setProjects([...projects, newProjectData]);
    setNewProject({ name: "", description: "" });
    // Redirect to the new project page
    router.push(`/project/${projectSlug}`);
  };

  const filteredProjects = projects
    .filter(
      (project) =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.description
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ??
          false)
    )
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6 ">
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-gray-600">{user.email}</p>
          <p className="mt-2">{user.bio}</p>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 mb-4 ">
        <Input
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select
          value={sortBy}
          onValueChange={(value) => setSortBy(value as "name" | "date")}
        >
          <SelectTrigger className="border rounded p-2 bg-inherit max-w-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Sort by Date</SelectItem>
            <SelectItem value="name">Sort by Name</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button className="mb-4">Add New Project</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Project</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddProject} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                value={newProject.name}
                onChange={(e) =>
                  setNewProject({ ...newProject, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium"
              >
                Description
              </label>
              <Input
                id="description"
                value={newProject.description}
                onChange={(e) =>
                  setNewProject({ ...newProject, description: e.target.value })
                }
                required
              />
            </div>
            <Button type="submit">Create Project</Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4 md:grid-cols-2">
        {filteredProjects.map((project) => (
          <ProjectBtn key={project.link} project={project} />
        ))}
      </div>
    </div>
  );
}
