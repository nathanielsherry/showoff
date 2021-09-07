from showoff.sources import Source, Document, Collection
from showoff import log
import os, traceback

class FilesystemSource(Source):
    def __init__(self, root_directory, settings=None):
        super().__init__()
        self._root_directory = root_directory
        self._settings = settings or {}      
    
    def _dir(self, path): return self._root_directory + '/' + '/'.join(path)
       
    def ls(self, apath):
        spath = self._dir(apath)
        entries = sorted(os.listdir(spath))
        if not self._settings.get('show-hidden', False):
            entries = [e for e in entries if not e.startswith('.')]
        return [(apath + [entry], spath + '/' + entry) for entry in entries]
    
    def at(self, apath):
        spath = self._dir(apath)
        if os.path.isdir(spath):
            return self.make_link(apath)
        else:
            return self.make_document(apath)
        
    
    #Returns a list of Documents
    def list_documents(self, path):
        return [self.make_document(apath) for (apath, spath) in self.ls(path) if not os.path.isdir(spath)]
            
    #Returns a list of Collections
    def list_links(self, path):
        return [self.make_link(apath) for (apath, spath) in self.ls(path) if os.path.isdir(spath)]
    
    def get_document_bytes(self, path):
        try:
            print('getbytes for ' + self._dir(path))
            with open(self._dir(path), 'rb') as fh:
                return fh.read()
        except:
            log.error(traceback.format_exc())
            return b''
            
    def get_document_size(self, path):
        return os.path.getsize(self._dir(path))

    def get_document_times(self, path):
        p = self._dir(path)
        return {
            'mtime': os.path.getmtime(p),
            'ctime': os.path.getctime(p),
            'atime': os.path.getatime(p),
        }

    def get_document_mimetype(self, path):
        import magic
        mime = magic.Magic(mime=True)
        return mime.from_file(self._dir(path))
