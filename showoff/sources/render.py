import tempfile, os, io, traceback

#Base class for rendering abstract documents at a series of power-of-two sizes
class Renderer:
    def __init__(self, source):
        self._source = source
        self._tmpdir = tempfile.TemporaryDirectory('-renderer', 'showoff-')
    
    @property
    def source(self): return self._source
    
    @property
    def workpath(self): return self._tmpdir.name
    
    def path_for(self, node, size):
        size = Renderer.snapsize(size)
        return '{root}/{size}/{path}'.format(
            root = self.workpath,
            size = size,
            path = '/'.join(node.path)
        )
        
    def has(self, node, size):
        size = Renderer.snapsize(size)
        return os.path.exists(self.path_for(node, size))
    
    def render(self, node, size):
        size = Renderer.snapsize(size)
        if not self.has(node, size):
            self.generate(node, size)
        return self.retrieve(node, size)
        
    def generate(self, node, size):
        raise Exception('Unimplemented')
    
    def can_render(self, mime):
        raise Exception('Unimplemented')
    
    def retrieve(self, node, size):
        with open(self.path_for(node, size), 'rb') as fh:
            return fh.read()
          
    @staticmethod  
    def snapsize(size):
        import math
        if isinstance(size, tuple): 
            size = max(size)
        if size < 16: size = 16
        if size > 8192: size = 8192
        exp = math.log2(size)
        size = int(math.pow(2, round(exp)))
        return size
    

        
class ImageRenderer(Renderer):
    def generate(self, node, size):
        bytes = b''
        try:
            from PIL import Image
            with io.BytesIO(node.bytes) as inbuf, io.BytesIO() as outbuf:
                   with Image.open(inbuf) as img:
                    img.thumbnail((size, size), Image.ANTIALIAS)
                    img = img.convert('RGB')
                    img.save(outbuf, format='jpeg')
                    bytes = outbuf.getvalue()
        except:
            log.error(traceback.format_exc())
        finally:
            try:
                os.makedirs(self.path_for(node.parent, size))
            except:
                pass
            with open(self.path_for(node, size), 'wb') as fh:
                return fh.write(bytes)

    def can_render(self, mime):
        raise Exception('Unimplemented')
