class window.Archive
  constructor: (@buffer) ->

  load: (url) ->
    xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.responseType = 'arraybuffer'
    self = @
    xhr.onload = ->
      if (this.status == 200)
        self.buffer = this.response
        self.type = self.TAR_CONTAINER
        return
    xhr.send();
    xhr

  error: (msg) ->
    throw new Error(msg)

  getFiles: (type=@type) ->
    switch(type)
      when @TAR_CONTAINER then container = window.Archive.TAR
      else error("Unknown container format")

    new window.Archive.FileList((new container()).parse @buffer)

  @TAR_CONTAINER = 1


