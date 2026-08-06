import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Load JSON seed data
import projectsData from '../data/projects.json';
import skillsData from '../data/skills.json';
import experienceData from '../data/experience.json';
import educationData from '../data/education.json';
import certificationsData from '../data/certifications.json';
import achievementsData from '../data/achievements.json';
import testimonialsData from '../data/testimonials.json';
import personalData from '../data/personal.json';


async function main() {
  console.log('🌱 Seeding database with CV data (TypeScript)...\n');

  // ── Seed Projects ──
  console.log('📦 Seeding Projects...');
  for (const p of projectsData) {
    await prisma.project.create({
      data: {
        title: p.name,
        tagline: p.tagline || null,
        description: p.tagline || p.name,
        techStack: p.techStack || [],
        features: p.features || [],
        githubUrl: p.github || null,
        demoUrl: p.demo || null,
        isFeatured: true,
      },
    });
  }
  console.log(`   ✅ ${projectsData.length} projects seeded.\n`);

  // ── Seed Skills ──
  console.log('🛠️  Seeding Skills...');
  const skillCategories = Object.entries(skillsData);
  let skillCount = 0;
  for (const [category, items] of skillCategories) {
    for (const skillName of items) {
      await prisma.skill.create({
        data: {
          name: skillName,
          category: category,
        },
      });
      skillCount++;
    }
  }
  console.log(`   ✅ ${skillCount} skills seeded.\n`);

  // ── Seed Experience ──
  console.log('💼 Seeding Experience...');
  for (const exp of experienceData) {
    await prisma.experience.create({
      data: {
        role: exp.role,
        company: exp.company,
        location: exp.location || null,
        startDate: exp.startDate,
        endDate: exp.endDate || null,
        responsibilities: exp.responsibilities || [],
        technologies: exp.technologies || [],
        impact: exp.impact || null,
      },
    });
  }
  console.log(`   ✅ ${experienceData.length} experience records seeded.\n`);

  // ── Seed Education ──
  console.log('🎓 Seeding Education...');
  for (const edu of educationData) {
    await prisma.education.create({
      data: {
        degree: edu.degree,
        institution: edu.institution,
        timeline: edu.timeline,
        relevantCourses: edu.relevantCourses || [],
      },
    });
  }
  console.log(`   ✅ ${educationData.length} education records seeded.\n`);

  // ── Seed Certifications ──
  console.log('📜 Seeding Certifications...');
  for (const cert of certificationsData) {
    await prisma.certification.create({
      data: {
        title: cert.title,
        issuer: cert.issuer,
        issueDate: cert.issueDate || null,
        credentialUrl: cert.credentialUrl || null,
      },
    });
  }
  console.log(`   ✅ ${certificationsData.length} certifications seeded.\n`);

  // ── Seed Achievements ──
  console.log('🏆 Seeding Achievements...');
  for (const ach of achievementsData) {
    await prisma.achievement.create({
      data: {
        title: ach.title,
        category: ach.category,
        description: ach.description,
        year: ach.year || null,
      },
    });
  }
  console.log(`   ✅ ${achievementsData.length} achievements seeded.\n`);

  // ── Seed Testimonials ──
  console.log('💬 Seeding Testimonials...');
  for (const t of testimonialsData) {
    await prisma.testimonial.create({
      data: {
        client: t.client,
        company: t.company || null,
        text: t.text,
        rating: t.rating || 5,
      },
    });
  }
  console.log(`   ✅ ${testimonialsData.length} testimonials seeded.\n`);

  // ── Seed Personal Profile ──
  console.log('👤 Seeding Personal Profile...');
  const existingProfile = await prisma.personalProfile.findFirst();
  if (!existingProfile) {
    await prisma.personalProfile.create({
      data: {
        name: personalData.name,
        title: personalData.title,
        bio: personalData.bio,
        location: personalData.location,
        availability: personalData.availability,
        email: personalData.email,
        phone: personalData.phone,
        resumeUrl: personalData.resumeUrl,
        github: personalData.github,
        portfolio: personalData.portfolio,
        profilePhoto: personalData.profilePhoto,
        bannerPhoto: personalData.bannerPhoto,
        linkedin: personalData.linkedin,
        facebook: personalData.facebook,
      },
    });
    console.log('   ✅ Personal Profile seeded.\n');
  }

  console.log('✨ TypeScript Database seeding complete!');

}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
