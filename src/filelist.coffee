class window.Archive.FileList
  constructor: (@files=[]) ->

  getFile: (path) ->
    filtered = @files.filter (file)-> file.filename == path
    if(filtered.length > 0) then filtered[0] else null
