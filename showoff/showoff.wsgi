from showoff import server
from showoff.sources.filesystem import FilesystemSource
from showoff.render import BasicRenderer
from showoff.server import create_application
from showoff.preload.thread import DaemonThreadPreloader
from showoff.preload.multiprocessing import MultiprocessingPreloader
    

server.source = FilesystemSource('/gallery')
server.static = '/var/www/html/'
server.renderer = BasicRenderer()
server.preloader = MultiprocessingPreloader(server.renderer)


application = create_application()
