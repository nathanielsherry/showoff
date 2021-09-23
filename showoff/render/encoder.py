import io, traceback

from showoff import log, util
from showoff.render import KIND_THUMBNAIL, KIND_PLACEHOLDER, KIND_FULLIMAGE



class Encoder:
    def encode(self, bytes, kind): raise Exception('Unimplemented')
    
    @property
    def settings(self): raise Exception('Unimplemented')
    

class WebPEncoder(Encoder):
    def __init__(self, settings=None):
        if not settings: settings = {}
        
        defaults = {
            KIND_FULLIMAGE: {
                'quality': 85,
                'method': 6,
            },
            KIND_PLACEHOLDER: {
                'quality': 10,
                'method': 6,
            },
            KIND_THUMBNAIL: {
                'quality': 50,
                'method': 6,
            }
        }
                    
        self._settings = util.overlay_dicts(settings, defaults)

    @property
    def settings(self): return self._settings

    def encode(self, bytes, kind):
        from PIL import Image
        with io.BytesIO(bytes) as inbuf, io.BytesIO() as outbuf:
            with Image.open(inbuf) as img:
                quality = self.settings[kind]['quality']
                method = self.settings[kind]['method']
                    
                if kind == KIND_THUMBNAIL:
                    img.thumbnail((192, 192), Image.ANTIALIAS)
                    
                img = img.convert('RGB')
                img.save(outbuf, format='webp', quality=quality, method=method)
                encoded = outbuf.getvalue()
        return encoded

