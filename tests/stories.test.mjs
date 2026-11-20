import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { openJournal, readStoryFields, saveStory, moderateStory, publishedStory, publishedStories, publishedPhoto } from "../src/lib/stories.mjs";
import { preparePhotos } from "../src/lib/story-photos.mjs";

test("anonymous story and image stay private through review, publish together and can be withdrawn", async () => {
  const dir = mkdtempSync(join(tmpdir(),"omi-journal-"));
  const db = openJournal(dir);
  try {
    const form = new FormData();
    form.set("title","A test journey"); form.set("body","A travel memory."); form.set("service","Thoughtful support.");
    assert.throws(()=>readStoryFields(form),/permission/);
    form.set("permission","yes");
    const png = await sharp({create:{width:16,height:12,channels:3,background:"green"}}).png().toBuffer();
    form.append("photos",new File([png],"tour.png")); form.append("captions","The hills");
    const photos = await preparePhotos(form);
    assert.equal((await sharp(photos[0].image).metadata()).format,"webp");
    const story = readStoryFields(form), key = randomUUID();
    const id = saveStory(db,key,story,photos);
    assert.equal(saveStory(db,key,story,photos),id);
    assert.throws(()=>saveStory(db,key,{...story,title:"Another story"},photos),/CHANGED/);
    assert.equal(publishedStory(db,id),null);
    assert.equal(publishedPhoto(db,id,0),undefined);
    assert.deepEqual(publishedStories(db,12,0),[]);
    moderateStory(db,id,"published");
    assert.equal(publishedStory(db,id).byline,"Guest traveler");
    assert.equal(publishedStory(db,id).service,story.service);
    assert.equal(publishedStory(db,id).photos[0].caption,"The hills");
    assert.ok(publishedPhoto(db,id,0).length);
    assert.equal(publishedStories(db,12,0)[0].id,id);
    moderateStory(db,id,"declined");
    assert.equal(publishedStory(db,id),null);
    assert.equal(publishedPhoto(db,id,0),undefined);
    assert.deepEqual(publishedStories(db,12,0),[]);
  } finally { db.close(); rmSync(dir,{recursive:true,force:true}); }
});

test("journal accepts a text-only entry and rejects unreadable photo uploads", async () => {
  const form = new FormData();
  assert.deepEqual(await preparePhotos(form),[]);
  form.append("photos",new File(["A text file"],"photo.jpg",{type:"image/jpeg"}));
  form.append("captions","");
  await assert.rejects(preparePhotos(form),/JPEG/);
});
