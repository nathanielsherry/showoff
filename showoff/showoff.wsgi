from showoff import server
from showoff.sources.filesystem import FilesystemSource
from showoff.render import ImageRenderer
from showoff.server import create_application
from showoff.preload.thread import DaemonThreadPreloader
from showoff.preload.multiprocessing import MultiprocessingPreloader
    

server.source = FilesystemSource('/gallery')
server.static = '/var/www/html/'
server.renderer = ImageRenderer()
#server.preloader = DaemonThreadPreloader(server.renderer)
server.preloader = MultiprocessingPreloader(server.renderer)


application = create_application()
