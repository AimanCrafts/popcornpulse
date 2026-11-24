-- CreateTable
CREATE TABLE "Feedback" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "eventDate" DATETIME NOT NULL,
    "rating" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Feedback_email_key" ON "Feedback"("email");
