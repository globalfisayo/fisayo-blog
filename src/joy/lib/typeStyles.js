// One hue per opportunity type — echoes the tag colors the team used in
// Notion so the page feels familiar. Used for type chips and the generated
// brand covers. Unknown types fall back to the site's primary blue.
const TYPE_HUES = {
  Job: 24, // orange
  Internship: 330, // pink
  'Graduate Program': 220, // slate blue
  Scholarship: 270, // purple
  Conference: 205, // blue
  Fellowship: 35, // amber brown
  Grant: 48, // yellow gold
  'Research Program': 200, // gray blue
  Funding: 168, // teal
  Bootcamp: 190, // cyan
  'Development Program': 15, // terracotta
  Opportunity: 220,
};

export function typeHue(type) {
  return TYPE_HUES[type] ?? 220;
}

export function chipStyle(type) {
  const h = typeHue(type);
  return {
    backgroundColor: `hsl(${h} 75% 95%)`,
    color: `hsl(${h} 65% 32%)`,
    borderColor: `hsl(${h} 55% 85%)`,
  };
}

export function coverGradient(type) {
  const h = typeHue(type);
  return `linear-gradient(135deg, hsl(${h} 72% 46%) 0%, hsl(${(h + 28) % 360} 68% 38%) 100%)`;
}
