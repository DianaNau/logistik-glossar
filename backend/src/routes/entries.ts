 import { Router, Request, Response } from 'express';                                   
  import { v4 as uuidv4 } from 'uuid';                                                   
  import { readEntries, writeEntries } from '../db';                                     
  import { GlossaryEntry } from '../types';                                              
                                                                                         
  const router = Router();                                                               
                                                                                         
  // GET /api/entries                                                                    
  router.get('/', (req: Request, res: Response) => {
    let entries = readEntries();                                                         
                                                                                         
    const search = req.query.search as string | undefined;                               
    if (search) {                                                                        
      const lower = search.toLowerCase();                                                
      entries = entries.filter(                                                          
        (e) =>                                                                           
          e.term.toLowerCase().includes(lower) ||                                        
          e.definition.toLowerCase().includes(lower)                                     
      );                                                                                 
    }                                                                                    
                                                                                         
    res.json(entries);                                                                   
  });             
                                                                                         
  // GET /api/entries/:id                                                                
  router.get('/:id', (req: Request, res: Response) => {
    const entries = readEntries();                                                       
    const entry = entries.find((e) => e.id === req.params.id);                           
                                                                                         
    if (!entry) {                                                                        
      res.status(404).json({ error: 'Eintrag nicht gefunden' });                         
      return;                                                                            
    }             
                                                                                         
    res.json(entry);                                                                     
  });
                                                                                         
  // POST /api/entries                                                                   
  router.post('/', (req: Request, res: Response) => {                                    
    const { term, definition, category, imageUrl, youtubeUrl } = req.body;               
                                                                                         
    if (!term || !definition) {                                                          
      res.status(400).json({ error: 'term und definition sind Pflichtfelder' });         
      return;                                                                            
    }                                                                                    
                                                                                         
    const newEntry: GlossaryEntry = {                                                    
      id: uuidv4(),
      term,                                                                              
      definition, 
      category,                                                                          
      imageUrl,   
      youtubeUrl,                                                                        
      createdAt: new Date().toISOString(),                                               
    };                                                                                   
                                                                                         
    const entries = readEntries();                                                       
    entries.push(newEntry);
    writeEntries(entries);                                                               
                                                                                         
    res.status(201).json(newEntry);                                                      
  });                                                                                    
                                                                                         
  // PUT /api/entries/:id                                                                
  router.put('/:id', (req: Request, res: Response) => {
    const entries = readEntries();                                                       
    const index = entries.findIndex((e) => e.id === req.params.id);                      
                                                                                         
    if (index === -1) {                                                                  
      res.status(404).json({ error: 'Eintrag nicht gefunden' });                         
      return;                                                                            
    }                                                                                    
                                                                                         
    const { term, definition, category, imageUrl, youtubeUrl } = req.body;               
                  
    entries[index] = {                                                                   
      ...entries[index],
      ...(term !== undefined && { term }),                                               
      ...(definition !== undefined && { definition }),                                   
      ...(category !== undefined && { category }),                                       
      ...(imageUrl !== undefined && { imageUrl }),                                       
      ...(youtubeUrl !== undefined && { youtubeUrl }),                                   
    };                                                                                   
                                                                                         
    writeEntries(entries);                                                               
    res.json(entries[index]);                                                            
  });                                                                                    
                  
  // DELETE /api/entries/:id                                                             
  router.delete('/:id', (req: Request, res: Response) => {
    const entries = readEntries();                                                       
    const filtered = entries.filter((e) => e.id !== req.params.id);                      
                                                                                         
    if (filtered.length === entries.length) {                                            
      res.status(404).json({ error: 'Eintrag nicht gefunden' });                         
      return;                                                                            
    }                                                                                    
                                                                                         
    writeEntries(filtered);                                                              
    res.status(204).send();
  });                                                                                    
                                                                                         
  export default router;                  