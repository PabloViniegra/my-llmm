-- CreateTable
CREATE TABLE "ConversationShare" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "conversationId" TEXT NOT NULL,
    "sharedByUserId" TEXT NOT NULL,
    "sharedWithUserId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ConversationShare_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ConversationShare_sharedByUserId_fkey" FOREIGN KEY ("sharedByUserId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ConversationShare_sharedWithUserId_fkey" FOREIGN KEY ("sharedWithUserId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "ConversationShare_sharedWithUserId_idx" ON "ConversationShare"("sharedWithUserId");

-- CreateIndex
CREATE INDEX "ConversationShare_conversationId_idx" ON "ConversationShare"("conversationId");

-- CreateIndex
CREATE UNIQUE INDEX "ConversationShare_conversationId_sharedWithUserId_key" ON "ConversationShare"("conversationId", "sharedWithUserId");
