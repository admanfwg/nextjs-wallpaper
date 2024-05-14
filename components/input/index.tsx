"use client";

import {
  Dispatch,
  KeyboardEvent,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { AppContext } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wallpaper } from "@/types/wallpaper";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
  wallpapers: Wallpaper[];
  setWallpapers: Dispatch<SetStateAction<Wallpaper[]>>;
}

export default function ({ setWallpapers }: Props) {
  const { user, fetchUserInfo } = useContext(AppContext);

  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [wallpaper, setWallpaper] = useState<Wallpaper | null>(null);
  const router = useRouter();

  const requestGenWallpaper = async function () {
    try {
      const uri = "/api/protected/gen-wallpaper";
      const params = {
        description: description,
      };

      setLoading(true);
      const resp = await fetch(uri, {
        method: "POST",
        body: JSON.stringify(params),
      });
      setLoading(false);

      if (resp.status === 401) {
        toast.error("请登录");
        router.push("/sign-in");
        return;
      }
      console.log("gen wallpaper resp", resp);

      if (resp.ok) {
        const { code, message, data } = await resp.json();
        if (code !== 0) {
          toast.error(message);
          return;
        }
        if (data && data.img_url) {
          fetchUserInfo();

          setDescription("");

          const wallpaper: Wallpaper = data;
          setWallpaper(wallpaper);
          setWallpapers((wallpapers: Wallpaper[]) => [
            wallpaper,
            ...wallpapers,
          ]);

          toast.success("壁纸生成成功");
          return;
        }
      }

      toast.error("壁纸生成失败");
    } catch (e) {
      console.log("search failed: ", e);
      toast.error("壁纸生成失败");
    }
  };

  const handleInputKeydown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Enter" && !e.shiftKey) {
      if (e.keyCode !== 229) {
        e.preventDefault();
        handleSubmit();
      }
    }
  };

  const handleSubmit = function () {
    if (!description) {
      toast.error("非法输入，请重新输入");
      inputRef.current?.focus();
      return;
    }

    if (!user) {
      toast.error("请登录");
      return;
    }

    if (user.credits && user.credits.left_credits < 1) {
      toast.error("余额不足");
      return;
    }

    requestGenWallpaper();
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="flex flex-col w-full">
      <form
        className="flex w-full flex-col gap-3 sm:flex-row"
        onSubmit={() => {
          return false;
        }}
      >
        <Input
          type="text"
          placeholder="描述文本"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={handleInputKeydown}
          disabled={loading}
          ref={inputRef}
        />

 
        <Button type="button" disabled={loading} onClick={handleSubmit}>
          {loading ? "生成中..." : "生成"}
        </Button>
      </form>
    </div>
  );
}
