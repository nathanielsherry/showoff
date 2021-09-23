import traceback

from showoff.sources import Collection
from showoff import log

class Preloader():
   
    def load(self, node): raise Exception("Unimplemented")
    
    @property
    def renderer(self): raise Exception("Unimplemented")
    
    
    def load_adjacent(self, node):
        parent = node.parent
        if not parent: return
        self.load_children(parent)
    
    def load_children(self, collection):
        for d in collection.documents:
            self.load(d)
        
    def load_subtree(self, collection):
        if not isinstance(collection, Collection):
            raise Exception("Subtree only available on nodes of type 'Collection'")
        collection.visit_subtree_leaves(lambda leaf: self.load(leaf))
        
    def render(self, node):
        try:
            r = self.renderer
            r.fullimage(node)
            r.thumbnail(node)
            r.placeholder(node)
        except KeyboardInterrupt:
            raise
        except:
            #TODO: leave some kind of marker so that we don't constantly re-preload
            #the same failing document?
            log.warn(traceback.format_exc())
    
