using System;
using System.Diagnostics;
using System.Drawing;
using WebFramework;
using SamsiMetric;
using WebFramework.Backend;
using System.Threading.Tasks;
using System.IO;

public class IVApplication
{

    static ThemeBasedColor TitlebarColor;

    public static void Main(string[] args)
    {
        AppManager.Validate(args, "SamsidParty", "SamsiMetric");
        App();
    }

    public static async Task App()
    {
        
        DevTools.Enable();
        DevTools.ForcePort(25631);
        DevTools.HotReload("http://192.168.100.100:25631/");


        //Change Color Based On Theme (light, dark)
        TitlebarColor = new ThemeBasedColor(Color.FromArgb(255, 255, 255), Color.FromArgb(34, 34, 34));

        WindowManager.Options = new WindowOptions()
        {
            TitlebarColor = TitlebarColor,
            StartWidthHeight = new Rectangle(0, 0, 1280, 720),
            NativeGamepadSupport = true
        };


        WebScript.Register<MainScript>("main");
        await AppManager.Start(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "WWW"), OnReady);
    }

    public static async Task OnReady(WebWindow w)
    {
        w.BackgroundColor = TitlebarColor;
    }

}