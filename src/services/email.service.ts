import sgMail from '@sendgrid/mail';

export interface ProjectDto {
    id: string;
    category: string;
    description: string;
    title: string;
    materials: string[];
    steps: string[];
    imageUrl: string;
    createdAt: Date | string;
    author: string;
    uploadedUserEmail: string;
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

interface EmailTemplate {
    to: string;
    from: string | { email: string; name: string };
    subject: string;
    html: string;
    text?: string;
}

export class EmailService {
    private static readonly FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@yourapp.com';
    private static readonly APP_NAME = process.env.APP_NAME || 'Creative Projects Hub';


    static async sendProjectUploadSuccessEmail(
        userEmail: string,
        project: ProjectDto,
        userName?: string
    ): Promise<boolean> {
        try {
            const emailTemplate = this.generateProjectUploadTemplate(
                userEmail,
                project,
                userName
            );

            await sgMail.send(emailTemplate);
            return true;
        } catch (error) {
            return false;
        }
    }


    private static generateProjectUploadTemplate(
        userEmail: string,
        project: ProjectDto,
        userName?: string
    ): EmailTemplate {
        const displayName = userName || userEmail.split('@')[0];

        const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Project Upload Success</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f8f9fa;
                margin: 0;
                padding: 20px;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 20px;
                overflow: hidden;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            }
            .header {
                background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                padding: 40px 30px;
                text-align: center;
                color: white;
            }
            .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: bold;
            }
            .header .emoji {
                font-size: 48px;
                margin-bottom: 15px;
                display: block;
            }
            .content {
                background: white;
                padding: 40px 30px;
            }
            .project-card {
                background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
                border-radius: 15px;
                padding: 25px;
                margin: 25px 0;
                border-left: 5px solid #ff6b6b;
            }
            .project-title {
                font-size: 22px;
                font-weight: bold;
                color: #2c3e50;
                margin-bottom: 10px;
            }
            .project-details {
                color: #5a6c7d;
                font-size: 16px;
                margin-bottom: 8px;
            }
            .project-details strong {
                color: #2c3e50;
            }
            .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 50px;
                font-weight: bold;
                font-size: 16px;
                margin: 20px 0;
                box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
                transition: transform 0.3s ease;
            }
            .cta-button:hover {
                transform: translateY(-2px);
            }
            .footer {
                background: #2c3e50;
                color: #bdc3c7;
                padding: 30px;
                text-align: center;
                font-size: 14px;
            }
            .footer a {
                color: #3498db;
                text-decoration: none;
            }
            .stats {
                display: flex;
                justify-content: space-around;
                margin: 20px 0;
                text-align: center;
            }
            .stat-item {
                flex: 1;
                padding: 15px;
                background: #f8f9fa;
                border-radius: 10px;
                margin: 0 5px;
            }
            .stat-number {
                font-size: 20px;
                font-weight: bold;
                color: #667eea;
            }
            .stat-label {
                font-size: 12px;
                color: #6c757d;
                text-transform: uppercase;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <span class="emoji">🎉</span>
                <h1>Project Successfully Uploaded!</h1>
                <p>Your creativity is now live and ready to inspire others!</p>
            </div>
            
            <div class="content">
                <p>Hi <strong>${displayName}</strong>,</p>
                
                <p>Great news! Your project has been successfully uploaded to ${this.APP_NAME} and is now live for the community to discover and enjoy.</p>
                
                <div class="project-card">
                    <div class="project-title">📂 ${project.title}</div>
                    <div class="project-details"><strong>Category:</strong> ${project.category}</div>
                    <div class="project-details"><strong>Author:</strong> ${project.author}</div>
                    <div class="project-details"><strong>Materials:</strong> ${project.materials.length} items</div>
                    <div class="project-details"><strong>Steps:</strong> ${project.steps.length} instructions</div>
                    <div class="project-details"><strong>Uploaded:</strong> ${new Date(project.createdAt).toLocaleDateString()}</div>
                </div>

                <div class="stats">
                    <div class="stat-item">
                        <div class="stat-number">${project.materials.length}</div>
                        <div class="stat-label">Materials</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">${project.steps.length}</div>
                        <div class="stat-label">Steps</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">LIVE</div>
                        <div class="stat-label">Status</div>
                    </div>
                </div>

                <p>Your project is now part of our creative community! Other makers can discover it, get inspired, and even create their own versions.</p>

                <div style="text-align: center;">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/projects/${project.id}" class="cta-button">
                        View Your Project 🚀
                    </a>
                </div>

                <h3>What's Next?</h3>
                <ul>
                    <li><strong>Share it:</strong> Tell your friends and social media followers about your new project</li>
                    <li><strong>Engage:</strong> Respond to comments and questions from the community</li>
                    <li><strong>Create more:</strong> Upload more of your amazing projects</li>
                    <li><strong>Explore:</strong> Check out what other creators are making</li>
                </ul>

                <p>Thank you for being part of our creative community. We can't wait to see what you'll create next!</p>

                <p>Happy creating! ✨<br>
                <strong>The ${this.APP_NAME} Team</strong></p>
            </div>

            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} ${this.APP_NAME}. All rights reserved.</p>
                <p>
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}">Visit Website</a> | 
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/profile">My Profile</a> | 
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/projects">Browse Projects</a>
                </p>
                <p>You received this email because you uploaded a project to ${this.APP_NAME}.</p>
            </div>
        </div>
    </body>
    </html>
    `;

        const textContent = `
    🎉 Project Successfully Uploaded!

    Hi ${displayName},

    Great news! Your project "${project.title}" has been successfully uploaded to ${this.APP_NAME}.

    Project Details:
    - Title: ${project.title}
    - Category: ${project.category}
    - Author: ${project.author}
    - Materials: ${project.materials.length} items
    - Steps: ${project.steps.length} instructions
    - Uploaded: ${new Date(project.createdAt).toLocaleDateString()}

    Your project is now live and ready for the community to discover!

    View your project: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/projects/${project.id}

    Thank you for being part of our creative community!

    The ${this.APP_NAME} Team
    `;

        return {
            to: userEmail,
            from: {
                email: this.FROM_EMAIL,
                name: this.APP_NAME
            },
            subject: `🎉 "${project.title}" Successfully Uploaded!`,
            html: htmlContent,
            text: textContent
        };
    }


    static async sendProjectUpdateEmail(
        userEmail: string,
        project: ProjectDto,
        userName?: string
    ): Promise<boolean> {
        try {
            const displayName = userName || userEmail.split('@')[0];

            const emailTemplate: EmailTemplate = {
                to: userEmail,
                from: {
                    email: this.FROM_EMAIL,
                    name: this.APP_NAME
                },
                subject: `📝 "${project.title}" Updated Successfully!`,
                html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Project Updated! 📝</h2>
          <p>Hi ${displayName},</p>
          <p>Your project "<strong>${project.title}</strong>" has been successfully updated.</p>
          <p>The changes are now live and visible to the community.</p>
          <a href="${process.env.FRONTEND_URL}/projects/${project.id}" 
             style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            View Updated Project
          </a>
        </div>
        `,
                text: `Project Updated! Hi ${displayName}, your project "${project.title}" has been successfully updated.`
            };

            await sgMail.send(emailTemplate);
            return true;
        } catch (error) {
            return false;
        }
    }

    static async sendTestEmail(userEmail: string): Promise<boolean> {
        try {
            const emailTemplate: EmailTemplate = {
                to: userEmail,
                from: {
                    email: this.FROM_EMAIL,
                    name: this.APP_NAME
                },
                subject: 'Test Email from Creative Projects Hub',
                html: '<h1>Test Email</h1><p>If you receive this, SendGrid is working correctly!</p>',
                text: 'Test Email - If you receive this, SendGrid is working correctly!'
            };

            await sgMail.send(emailTemplate);
            return true;
        } catch (error) {
            return false;
        }
    }
}