/*
  archive.js - v0.1.0 - Nov 25, 2012
  <https://github.com/niklasvh/archive.js>
  Copyright (c) 2012 Niklas von Hertzen (@niklasvh)

  Licensed under MIT license
*/

(function(window, document, undefined){

(function() {

  window.Archive = (function() {

    function Archive(buffer) {
      this.buffer = buffer;
    }

    Archive.prototype.load = function(url) {
      var self, xhr;
      xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'arraybuffer';
      self = this;
      xhr.onload = function() {
        if (this.status === 200) {
          self.buffer = this.response;
          self.type = self.TAR_CONTAINER;
        }
      };
      xhr.send();
      return xhr;
    };

    Archive.prototype.error = function(msg) {
      throw new Error(msg);
    };

    Archive.prototype.getFiles = function(type) {
      var container;
      if (type == null) {
        type = this.type;
      }
      switch (type) {
        case this.TAR_CONTAINER:
          container = window.Archive.TAR;
          break;
        default:
          error("Unknown container format");
      }
      return new window.Archive.FileList((new container()).parse(this.buffer));
    };

    Archive.TAR_CONTAINER = 1;

    return Archive;

  })();

}).call(this);

(function() {

  window.Archive.File = (function() {

    function File(filename, buffer, compressed) {
      this.filename = filename;
      this.buffer = buffer;
      this.compressed = compressed != null ? compressed : false;
    }

    return File;

  })();

}).call(this);

(function() {

  window.Archive.FileList = (function() {

    function FileList(files) {
      this.files = files != null ? files : [];
    }

    FileList.prototype.getFile = function(path) {
      var filtered;
      filtered = this.files.filter(function(file) {
        return file.filename === path;
      });
      if (filtered.length > 0) {
        return filtered[0];
      } else {
        return null;
      }
    };

    return FileList;

  })();

}).call(this);

(function() {

  window.Archive.TAR = (function() {

    function TAR() {}

    TAR.prototype.parse = function(buffer) {
      var content, i, mtime, name, pos, size, uint8, _i, _j, _k, _ref, _ref1, _ref2, _ref3, _ref4, _results;
      uint8 = new Uint8Array(buffer);
      pos = 0;
      _results = [];
      while (pos < buffer.byteLength) {
        name = "";
        for (i = _i = pos, _ref = pos + 99; pos <= _ref ? _i <= _ref : _i >= _ref; i = pos <= _ref ? ++_i : --_i) {
          if (uint8[i] !== 0) {
            name += String.fromCharCode(uint8[i]);
          }
        }
        if (name.length === 0) {
          break;
        }
        size = "";
        for (i = _j = _ref1 = pos + 124, _ref2 = pos + 135; _j <= _ref2; i = _j += 1) {
          size += String.fromCharCode(uint8[i]);
        }
        mtime = "";
        for (i = _k = _ref3 = pos + 136, _ref4 = pos + 147; _k <= _ref4; i = _k += 1) {
          mtime += String.fromCharCode(uint8[i]);
        }
        pos += 512;
        size = parseInt(size.replace(/^[0]+/g, ""), 8);
        content = buffer.slice(pos, (pos += size));
        pos += 512 - (pos % 512);
        _results.push(new window.Archive.File(name, content));
      }
      return _results;
    };

    return TAR;

  })();

}).call(this);

})(window,document);
