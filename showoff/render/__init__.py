import tempfile, os, io, traceback

from showoff import log

KIND_THUMBNAIL = 'thumb'
KIND_PLACEHOLDER = 'placeholder'
KIND_FULLIMAGE = 'full'

#Base class for rendering abstract documents in various configurations
class Renderer:
    
    def fullimage(self, node): return self.access(node, KIND_FULLIMAGE)
    def placeholder(self, node): return self.access(node, KIND_PLACEHOLDER)
    def thumbnail(self, node): return self.access(node, KIND_THUMBNAIL)
    

    @property
    def workpath(self): raise Exception('Unimplemented')
        
    def render(self, node): raise Exception('Unimplemented')
    def can_render(self, node): raise Exception('Unimplemented')
    
    def store(self, node, kind, bytes): raise Exception('Unimplemented')
    def retrieve(self, node, kind): raise Exception('Unimplemented')
    def generate(self, node, kind): raise Exception('Unimplemented')
    def access(self, node, kind):
        if not self.has(node, kind):
            bytes = self.generate(node, kind)
            self.store(node, kind, bytes)
            return bytes
        else:
            return self.retrieve(node, kind)
    
    def path_for(self, node, kind): raise Exception('Unimplemented')
    def has(self, node, kind): raise Exception('Unimplemented')


#Most of the machinery can be implemented once here. Generates images, 
#thumbnails and placeholders with the decoder/encoder and caches the 
#results in a temp dir
class BasicRenderer(Renderer):
    
    def __init__(self, decoder=None, encoder=None):
        self._tmpdir = tempfile.TemporaryDirectory('-renderer', 'showoff-')
        
        from showoff.render.encoder import WebPEncoder
        from showoff.render.decoder import ImageDecoder
        self._decoder = decoder or ImageDecoder()
        self._encoder = encoder or WebPEncoder()
    
    @property
    def workpath(self): return self._tmpdir.name
    
    @property
    def decoder(self): return self._decoder
    
    @property
    def encoder(self): return self._encoder
    
    def can_render(self, node): return self.decoder.can_decode(node)
    
    def path_for(self, node, kind=None):
        #No kind means return the directory name for this file's various
        #renders
        if kind:
            return '{root}/{path}/{kind}'.format(
                root = self.workpath,
                path = '/'.join(node.path),
                kind = kind
            )
        else:
            return '{root}/{path}/'.format(
                root = self.workpath,
                path = '/'.join(node.path)
            )
    
    def has(self, node, kind):
        return os.path.exists(self.path_for(node, kind))

    

    def store(self, node, kind, bytes):
        filename = self.path_for(node, kind)
        dirname = self.path_for(node, None)
        if not os.path.exists(dirname):
            os.makedirs(dirname)
        with open(filename, 'wb') as fh:
            fh.write(bytes)

    def retrieve(self, node, kind):
        with open(self.path_for(node, kind), 'rb') as fh:
            return fh.read()
         
    def generate(self, node, kind):
        
        #If we're rendering the full image, grab the raw bytes, otherwise
        #start with the full image
        inbytes = None
        if kind == KIND_FULLIMAGE:
            inbytes = self.decoder.decode(node)
        else:
            inbytes = self.fullimage(node)
        
        return self.encoder.encode(inbytes, kind)
          
    
    #TODO: remove this?
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
    

        

