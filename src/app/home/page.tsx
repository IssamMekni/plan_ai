import ProjectBtn from "@/components/ProjectBtn";

export default function page() {
  const project = {
    "link":"/",
    "imageUrl": "https://archive.org/download/placeholder-image/placeholder-image.jpg",
    "name": "Project Delta",
    "date": "2024-03-03",
    "diagramsCount": 7,
    "description": "A cutting-edge initiative to optimize workflow efficiency.A cutting-edge initiative to optimize workflow efficiency.A cutting-edge initiative to optimize workflow efficiency.A cutting-edge initiative to optimize workflow efficiency."
  };
  return (
    <div>
      <div className="m-2 md:w-2/3 lg:w-1/2 sm:m-auto grid grid-cols-1 flex-col gap-4">
        <ProjectBtn project={project} />

      </div>
    </div>
  );
}
