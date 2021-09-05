#!/usr/bin/python

import sys, json, io
from flask import Flask, url_for, send_file
from sources.filesystem import FilesystemSource
from sources import Collection, Document

root_dir = sys.argv[1]
source = FilesystemSource(root_dir)
app = Flask(__name__, static_url_path='/')
app.url_map.strict_slashes = False

@app.before_request
def clean_path():
    from flask import redirect, request
    path = request.path
    path = path.replace('//', '/')
    if path != '/' and path.endswith('/'):
        path = path[:-1]
    return None if path == request.path else redirect(path);

def split_path(path):
    path = path.split('/')
    return [p for p in path if p]

@app.route('/api/list/', defaults={'path': ''})
@app.route('/api/list/<path:path>')
def list(path):
    node = source.at(split_path(path))  
    return node.dump(deep=True)

@app.route('/api/image/<path:path>')
def image(path):
    node = source.document_at(split_path(path))
    return send_file(
        io.BytesIO(node.image),
        mimetype=node.datatype)

@app.route('/api/thumb/<path:path>')
def thumb(path):
    node = source.at(split_path(path))
    if node.datatype == 'collection':
        return send_file(
            './static/folder.png',
            mimetype='image')
    else:
        return send_file(
            io.BytesIO(node.thumb),
            mimetype=node.datatype)

if __name__ == "__main__":
    app.run(debug=True) 