import { BotCommand } from "../types.js";
import ytdl from "ytdl-core";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";

const videoCommand: BotCommand = {
  name: "video",
  category: "Media",
  description: "Download and convert YouTube videos using ytdl-core and ffmpeg",
  usage: ".video <youtube-url>",
  aliases: ["ytvideo", "ytmp4"],
  execute: async (sock, msg, context) => {
    try {
      const args = context.args;
      if (args.length === 0) {
        await context.reply("❌ *Usage:* `.video <youtube-url>`\n\nExample: `.video https://www.youtube.com/watch?v=dQw4w9WgXcQ`");
        return;
      }

      const rawUrl = args.join(" ").trim();
      
      // Basic URL verification
      if (!ytdl.validateURL(rawUrl)) {
        await context.reply("❌ *Error:* Invalid YouTube URL. Please provide a valid watch or short URL.");
        return;
      }

      await context.react("⏳");
      await context.reply("⏳ *Fetching video metadata...* Please wait.");

      let info;
      try {
        info = await ytdl.getInfo(rawUrl);
      } catch (err: any) {
        console.error("[Video YTDL error]:", err);
        await context.react("❌");
        await context.reply(`❌ *Failed to retrieve video metadata:* ${err.message || err}\n\n_This can happen if YouTube has updated their signatures or block IP addresses. Try using .download as a fallback!_`);
        return;
      }

      const videoTitle = info.videoDetails.title || "YouTube Video";
      const durationSecs = parseInt(info.videoDetails.lengthSeconds || "0", 10);
      
      // Limit to 10 minutes to avoid high resource consumption
      if (durationSecs > 600) {
        await context.react("⚠️");
        await context.reply("⚠️ *Error:* Video duration exceeds 10 minutes! Please provide a shorter video.");
        return;
      }

      // Find suitable formats with video + audio combined (typically 18 or 22 for 360p/720p mp4)
      const format = ytdl.chooseFormat(info.formats, {
        quality: "highest",
        filter: "audioandvideo"
      });

      if (!format) {
        await context.react("❌");
        await context.reply("❌ *Error:* No suitable format with both audio and video found.");
        return;
      }

      // Check size estimate. ytdl formats often don't have contentLength, but if they do, check it.
      if (format.contentLength) {
        const sizeBytes = parseInt(format.contentLength, 10);
        const sizeMB = sizeBytes / (1024 * 1024);
        if (sizeMB > 50) {
          await context.react("⚠️");
          await context.reply(`⚠️ *Error:* Video file size (~${sizeMB.toFixed(1)} MB) is too large. WhatsApp media limit is 50MB.`);
          return;
        }
      }

      await context.reply(`📥 *Downloading and converting video:* \n"${videoTitle}"\n\n⚙️ Processing with FFmpeg bypass tunnels...`);
      await context.react("🔄");

      // Setup paths for temporary processing to ensure memory efficiency
      const tempInPath = path.join(process.cwd(), `temp_in_${Date.now()}.mp4`);
      const tempOutPath = path.join(process.cwd(), `temp_out_${Date.now()}.mp4`);

      // Stream download to file
      const downloadStream = ytdl(rawUrl, { format });
      const writeStream = fs.createWriteStream(tempInPath);

      await new Promise<void>((resolve, reject) => {
        downloadStream.pipe(writeStream);
        writeStream.on("finish", () => resolve());
        writeStream.on("error", (err) => reject(err));
      });

      // Check the downloaded file size
      const stats = fs.statSync(tempInPath);
      const actualSizeMB = stats.size / (1024 * 1024);
      if (actualSizeMB > 50) {
        fs.unlinkSync(tempInPath);
        await context.react("⚠️");
        await context.reply(`⚠️ *Error:* Downloaded file size (${actualSizeMB.toFixed(1)} MB) exceeds the 50MB limit.`);
        return;
      }

      // Process with FFmpeg to ensure high-compatibility mobile codec container
      await new Promise<void>((resolve, reject) => {
        ffmpeg(tempInPath)
          .output(tempOutPath)
          .videoCodec("libx264")
          .audioCodec("aac")
          .outputOptions([
            "-pix_fmt yuv420p",
            "-profile:v baseline",
            "-level 3.0",
            "-crf 28", // Compresses with reasonable quality to ensure small file size
            "-preset fast"
          ])
          .on("end", () => {
            resolve();
          })
          .on("error", (err: any) => {
            console.error("FFmpeg error:", err);
            reject(err);
          })
          .run();
      });

      // Send the processed video
      if (fs.existsSync(tempOutPath)) {
        const outStats = fs.statSync(tempOutPath);
        console.log(`[Video Command] Processed size: ${(outStats.size / (1024 * 1024)).toFixed(2)} MB`);
        
        const videoBuffer = fs.readFileSync(tempOutPath);
        
        await sock.sendMessage(msg.key.remoteJid, {
          video: videoBuffer,
          caption: `🎥 *Video:* ${videoTitle}\n⚖️ *Size:* ${(outStats.size / (1024 * 1024)).toFixed(1)} MB`,
          mimetype: "video/mp4"
        }, { quoted: msg });

        await context.react("✅");
      } else {
        throw new Error("Failed to produce video output file.");
      }

      // Clean up temporary files
      try {
        if (fs.existsSync(tempInPath)) fs.unlinkSync(tempInPath);
        if (fs.existsSync(tempOutPath)) fs.unlinkSync(tempOutPath);
      } catch (cleanErr) {
        console.error("Failed to clean temporary video files:", cleanErr);
      }

    } catch (error: any) {
      console.error("[Video Command Error]:", error);
      await context.react("❌");
      await context.reply(`❌ *Failed to download or process video:* ${error.message || error}`);
    }
  }
};

export default videoCommand;
