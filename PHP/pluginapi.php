<?php 

class PluginAPI {
    public static $pluginFolder = "./Plugins";
    public static $plugins = array();

    static function FindPluginFolder($folder) {
        if (is_dir($folder)) {
            PluginAPI::$pluginFolder = $folder;
        }
    }
    
    //https://stackoverflow.com/a/24784144/18071273
    static function FindPlugins($dir, &$results = array()) {
        $files = scandir($dir);
    
        foreach ($files as $key => $value) {
            $path = realpath($dir . DIRECTORY_SEPARATOR . $value);
            if (!is_dir($path)) {
                $results[] = $path;
            } else if ($value != "." && $value != "..") {
                PluginAPI::FindPlugins($path, $results);
                $results[] = $path;
            }
        }
    
        return $results;
    }
    
    static function LoadAllPlugins() {
        
        if (!is_dir(PluginAPI::$pluginFolder)) {
            //Find Plugins Folder Up To 2 Directories Up
            PluginAPI::FindPluginFolder("../Plugins");
            PluginAPI::FindPluginFolder("../../Plugins");
        }

        PluginAPI::$plugins = PluginAPI::FindPlugins(PluginAPI::$pluginFolder);

        foreach (PluginAPI::$plugins as $plugin) {
            //Load All PHP Files That End With .plugin.php
            if (str_ends_with($plugin, ".plugin.php")) {
                require($plugin);
            }
        }
    }

}

PluginAPI::LoadAllPlugins();

?>