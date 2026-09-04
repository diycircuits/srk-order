import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'database.sqlite');
const backupDir = path.join(__dirname, 'backups');

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

export const createBackupSnapshot = async () => {
  try {
    if (!fs.existsSync(dbPath)) return null;

    const now = new Date();
    const dateStr = now.toISOString().replace(/T/, '_').replace(/:/g, '-').slice(0, 19);
    const backupFileName = `SRK_DB_Backup_${dateStr}.sqlite`;
    const destPath = path.join(backupDir, backupFileName);

    fs.copyFileSync(dbPath, destPath);
    console.log(`🛡️ [Zero Data Loss Engine] Database snapshot created: server/backups/${backupFileName}`);
    
    cleanOldBackups();
    return { fileName: backupFileName, path: destPath, createdAt: now.toISOString() };
  } catch (err) {
    console.error('❌ Error creating DB backup snapshot:', err.message);
    return null;
  }
};

export const listBackups = () => {
  try {
    if (!fs.existsSync(backupDir)) return [];
    const files = fs.readdirSync(backupDir);
    return files
      .filter(f => f.endsWith('.sqlite'))
      .map(f => {
        const stats = fs.statSync(path.join(backupDir, f));
        return {
          fileName: f,
          sizeBytes: stats.size,
          sizeMb: (stats.size / (1024 * 1024)).toFixed(2) + ' MB',
          createdAt: stats.mtime
        };
      })
      .sort((a, b) => b.createdAt - a.createdAt);
  } catch (err) {
    console.error('❌ Error listing backups:', err.message);
    return [];
  }
};

export const restoreBackupSnapshot = async (fileName) => {
  try {
    const targetBackup = path.join(backupDir, fileName);
    if (!fs.existsSync(targetBackup)) {
      throw new Error(`Backup file ${fileName} not found`);
    }

    // Backup current DB state before restore
    await createBackupSnapshot();

    fs.copyFileSync(targetBackup, dbPath);
    console.log(`🔄 Database restored from snapshot: ${fileName}`);
    return true;
  } catch (err) {
    console.error('❌ Restore backup failed:', err.message);
    throw err;
  }
};

const cleanOldBackups = () => {
  try {
    const backups = listBackups();
    const MAX_BACKUPS = 30; // Keep up to 30 historical snapshot files
    if (backups.length > MAX_BACKUPS) {
      const toDelete = backups.slice(MAX_BACKUPS);
      for (const item of toDelete) {
        const filePath = path.join(backupDir, item.fileName);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
    }
  } catch (err) {
    console.error('Error cleaning old backups:', err);
  }
};

// Start background auto-backup timer (Every 6 hours)
export const initAutoBackupScheduler = () => {
  createBackupSnapshot(); // Snapshot on server boot
  setInterval(() => {
    createBackupSnapshot();
  }, 6 * 60 * 60 * 1000);
};
