import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  // قراءة البيانات من ملف seed.json
  const data = JSON.parse(fs.readFileSync('prisma/seed.json', 'utf-8'));

  // إدخال البيانات الخاصة بـ Admins
  for (const admin of data.admins) {
    await prisma.admin.create({
      data: admin,
    });
  }

  // إدخال البيانات الخاصة بـ Users
  for (const user of data.users) {
    await prisma.user.create({
      data: user,
    });
  }

  // إدخال البيانات الخاصة بـ AI Models
  for (const aiModel of data.aiModels) {
    await prisma.aiModel.create({
      data: aiModel,
    });
  }

  // إدخال البيانات الخاصة بـ Conversations
  for (const conversation of data.conversations) {
    await prisma.conversation.create({
      data: conversation,
    });
  }

  // إدخال البيانات الخاصة بـ Messages
  for (const message of data.messages) {
    await prisma.message.create({
      data: message,
    });
  }

  // إدخال البيانات الخاصة بـ Projects
  for (const project of data.projects) {
    await prisma.project.create({
      data: project,
    });
  }

  // إدخال البيانات الخاصة بـ Diagrams
  for (const diagram of data.diagrams) {
    await prisma.diagram.create({
      data: diagram,
    });
  }

  console.log('تم إدخال جميع البيانات بنجاح');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
