export const FILE_NAME = 'afterrain_journals.json';

export const getJournalsFromDrive = async (accessToken) => {
  try {
    // 1. Search for the file in appDataFolder, getting newest first
    const query = encodeURIComponent(`name='${FILE_NAME}'`);
    const searchRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}&spaces=appDataFolder&fields=files(id)&orderBy=createdTime desc`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    
    if (searchRes.status === 401) throw new Error('401');
    if (!searchRes.ok) throw new Error('Failed to search Drive');
    
    const searchData = await searchRes.json();
    
    if (searchData.files && searchData.files.length > 0) {
      const fileId = searchData.files[0].id;
      
      // 2. Download content
      const contentRes = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      if (!contentRes.ok) throw new Error('Failed to download file');
      
      try {
        const text = await contentRes.text();
        const content = text ? JSON.parse(text) : [];
        return { fileId, entries: content };
      } catch (parseError) {
        console.error("Corrupted JSON in Drive, resetting entries but keeping fileId:", parseError);
        return { fileId, entries: [] };
      }
    }
    
    // File doesn't exist yet
    return { fileId: null, entries: [] };
  } catch (error) {
    console.error("Drive Sync Error (Get):", error);
    return { fileId: null, entries: null, error };
  }
};

export const saveJournalsToDrive = async (accessToken, fileId, entries) => {
  try {
    let currentFileId = fileId;
    const bodyContent = JSON.stringify(entries);

    // 1. If file doesn't exist, create it first (metadata only)
    if (!currentFileId) {
      const metadata = {
        name: FILE_NAME,
        parents: ['appDataFolder']
      };
      
      const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(metadata)
      });
      
      if (!createRes.ok) throw new Error('Failed to create file metadata');
      const createData = await createRes.json();
      currentFileId = createData.id;
    }
    
    // 2. Upload the actual content to the fileId
    const uploadRes = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${currentFileId}?uploadType=media`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: bodyContent
    });
    
    if (!uploadRes.ok) throw new Error('Failed to upload file content');
    
    return currentFileId;

  } catch (error) {
    console.error("Drive Sync Error (Save):", error);
    throw error;
  }
};
