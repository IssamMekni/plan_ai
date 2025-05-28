-- CreateTable
CREATE TABLE "DiagramConversation" (
    "id" TEXT NOT NULL,
    "diagramId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiagramConversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiagramConversationMessage" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isCodeResponse" BOOLEAN NOT NULL DEFAULT false,
    "timestamp" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DiagramConversationMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DiagramConversation_diagramId_key" ON "DiagramConversation"("diagramId");

-- CreateIndex
CREATE UNIQUE INDEX "DiagramConversation_sessionId_key" ON "DiagramConversation"("sessionId");

-- CreateIndex
CREATE INDEX "DiagramConversationMessage_conversationId_timestamp_idx" ON "DiagramConversationMessage"("conversationId", "timestamp");

-- AddForeignKey
ALTER TABLE "DiagramConversation" ADD CONSTRAINT "DiagramConversation_diagramId_fkey" FOREIGN KEY ("diagramId") REFERENCES "Diagram"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiagramConversation" ADD CONSTRAINT "DiagramConversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiagramConversationMessage" ADD CONSTRAINT "DiagramConversationMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "DiagramConversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
