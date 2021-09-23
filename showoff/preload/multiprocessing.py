import os, time
from multiprocessing import Process, Queue
from threading import Thread

from showoff.preload import Preloader


class MultiprocessingPreloader(Thread, Preloader):
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
        workers = [Process(target=process, args=(self,)) for i in range(0, os.cpu_count())]
        self._workers = workers
        try:
            for worker in workers:
                worker.start()
        except KeyboardInterrupt:
            workers.terminate()
        finally:
            for worker in workers:
                worker.join()
            

def process(preloader):
    os.nice(19)
    while True:
        #Don't be a *total* jerk about it
        time.sleep(1)
        node = preloader._queue.get()
        preloader.render(node)

