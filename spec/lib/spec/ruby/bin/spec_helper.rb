
require 'fileutils'

load File.dirname(__FILE__) + '/../../../bin/jspec'

def jspec name, *args
  capture do
    command(name).run *args
  end
end

def capture &block
  IO.popen('-') do |io|
    io ? io.read : yield
  end
end

def shell *args
  IO.popen(JSPEC_ROOT + '/bin/jspec shell', 'r+') do |io|
    args.each do |arg|
      io.puts arg
    end
    io.read
  end
end