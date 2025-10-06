import { prisma } from './apps/web/lib/prisma';

async function clearFailedImports() {
  try {
    // Delete failed imports
    const deleted = await prisma.skillImport.deleteMany({
      where: {
        status: 'failed',
      },
    });
    
    console.log(`Deleted ${deleted.count} failed imports`);
    
    // Also delete imports that are stuck in processing
    const deletedStuck = await prisma.skillImport.deleteMany({
      where: {
        status: 'processing',
        startedAt: {
          lt: new Date(Date.now() - 5 * 60 * 1000), // Older than 5 minutes
        },
      },
    });
    
    console.log(`Deleted ${deletedStuck.count} stuck imports`);
    
  } catch (error) {
    console.error('Error clearing imports:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearFailedImports();
