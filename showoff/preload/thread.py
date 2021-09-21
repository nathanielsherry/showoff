from showoff.preload import Preloader

from queue import Queue
from threading import Thread
import os
class DaemonThreadPreloader(Thread, Preloader):
    def __init__(self, renderer):
        super().__init__(daemon=True)
        self._renderer = renderer
        self._queue = Queue()
        self._workers = []
    
    @property
    def renderer(self): return self._renderer
    
    def load(self, node): 
        self._queue.put(node)
    
    def run(self):
        try:
            while True:
                node = self._queue.get()
                print((node, node.path))
                self.render(node)
        except KeyboardInterrupt:
            pass
