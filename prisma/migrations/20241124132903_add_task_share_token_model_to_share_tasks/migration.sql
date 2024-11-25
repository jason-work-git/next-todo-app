-- CreateTable
CREATE TABLE "TaskShareToken" (
    "id" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "token" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "role" "TaskRole" NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskShareToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TaskShareToken_token_key" ON "TaskShareToken"("token");

-- AddForeignKey
ALTER TABLE "TaskShareToken" ADD CONSTRAINT "TaskShareToken_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
