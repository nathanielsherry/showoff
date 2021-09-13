import tempfile, os, io, traceback
from showoff import log

class Thumbnailer:
    def __init__(self, source, size=128):
        self._source = source
        self._size = size
        self._tmpdir = tempfile.TemporaryDirectory('-thumbnailer', 'showoff-')
    
    @property
    def source(self): return self._source
    
    @property
    def size(self): return self._size
    
    @property
    def workpath(self): return self._tmpdir.name
    
    def path_for(self, node):
        return self.workpath + '/' + '/'.join(node.path)
    
    def thumbnail(self, node):
        if not self.has(node):
            self.generate(node)
        return self.retrieve(node)           
    
    def has(self, node):
        return os.path.exists(self.path_for(node))
        
    def retrieve(self, node):
        with open(self.path_for(node), 'rb') as fh:
            return fh.read()
    
    def generate(self, node):
        bytes = b''
        try:
            from PIL import Image
            with io.BytesIO(node.bytes) as inbuf, io.BytesIO() as outbuf:
                   with Image.open(inbuf) as img:
                    img.thumbnail((self.size, self.size), Image.ANTIALIAS)
                    img = img.convert('RGB')
                    img.save(outbuf, format='jpeg')
                    bytes = outbuf.getvalue()
        except:
            log.error(traceback.format_exc())
        finally:
            try:
                os.makedirs(self.path_for(node.parent))
            except:
                pass
            with open(self.path_for(node), 'wb') as fh:
                return fh.write(bytes)
            
